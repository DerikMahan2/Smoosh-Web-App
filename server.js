
/*
=========================================
SMOOSH FOOD TRUCK
Project Deliverable 3
Node.js / Express / MongoDB Backend
=========================================
*/

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const MONGO_URL =
    process.env.MONGO_URL ||
    "mongodb://127.0.0.1:27017";

const DATABASE_NAME = "smoosh";
const PREPARATION_MINUTES = 20;

let database;
let mongoClient;

// =========================================
// MIDDLEWARE
// =========================================

app.use(express.json({ limit: "20kb" }));

// =========================================
// HEALTH CHECK
// =========================================

app.get("/api/health", async (req, res) => {
    try {
        await database.command({ ping: 1 });

        res.json({
            status: "ok",
            application: "Smoosh Food Truck",
            database: "connected"
        });

    } catch (error) {
        res.status(503).json({
            status: "error",
            database: "disconnected"
        });
    }
});

// =========================================
// RETRIEVE AVAILABLE MENU PRODUCTS
// =========================================

app.get("/api/products", async (req, res) => {
    try {
        const products = await database
            .collection("products")
            .find({ available: true })
            .toArray();

        res.json(products);

    } catch (error) {
        console.error("Product retrieval error:", error);

        res.status(500).json({
            error: "Unable to retrieve menu products."
        });
    }
});

// =========================================
// SUBMIT NEW CUSTOMER ORDER
// =========================================

app.post("/api/orders", async (req, res) => {
    try {
        const {
            customerName,
            phone,
            email,
            specialInstructions,
            items
        } = req.body || {};

        // Validate customer details.

        if (
            typeof customerName !== "string" ||
            !customerName.trim() ||
            customerName.length > 100
        ) {
            return res.status(400).json({
                error: "Please enter a valid customer name."
            });
        }

        if (
            typeof phone !== "string" ||
            !/^[0-9()+.\-\s]{7,25}$/.test(phone)
        ) {
            return res.status(400).json({
                error: "Please enter a valid phone number."
            });
        }

        if (
            email != null &&
            email !== "" &&
            (
                typeof email !== "string" ||
                email.length > 254 ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            )
        ) {
            return res.status(400).json({
                error: "Please enter a valid email address."
            });
        }

        if (
            specialInstructions != null &&
            (
                typeof specialInstructions !== "string" ||
                specialInstructions.length > 1000
            )
        ) {
            return res.status(400).json({
                error: "Special instructions are too long."
            });
        }

        if (
            !Array.isArray(items) ||
            items.length === 0 ||
            items.length > 30
        ) {
            return res.status(400).json({
                error: "Your order must contain valid items."
            });
        }

        // Validate product IDs and quantities.

        for (const item of items) {
            if (
                !item ||
                typeof item.productId !== "string" ||
                !ObjectId.isValid(item.productId) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 50
            ) {
                return res.status(400).json({
                    error: "An order item is invalid."
                });
            }
        }

        // Retrieve products directly from MongoDB.

        const productIds = [
            ...new Set(items.map(item => item.productId))
        ];

        const products = await database
            .collection("products")
            .find({
                _id: {
                    $in: productIds.map(
                        id => new ObjectId(id)
                    )
                },
                available: true
            })
            .toArray();

        const productMap = new Map(
            products.map(product => [
                product._id.toString(),
                product
            ])
        );

        // Build trusted order lines.
        // Never trust browser-submitted prices.

        const validatedItems = [];
        let totalCents = 0;

        for (const item of items) {
            const product = productMap.get(item.productId);

            if (!product) {
                return res.status(400).json({
                    error: "A selected product is unavailable."
                });
            }

            const options = Array.isArray(product.options)
                ? product.options
                : [];

            let selectedOption = null;

            if (options.length > 0) {
                if (
                    typeof item.option !== "string" ||
                    !options.includes(item.option)
                ) {
                    return res.status(400).json({
                        error:
                            "Please select a valid option for " +
                            product.name + "."
                    });
                }

                selectedOption = item.option;
            }

            const unitCents = Math.round(
                Number(product.price) * 100
            );

            if (
                !Number.isSafeInteger(unitCents) ||
                unitCents < 0
            ) {
                throw new Error(
                    "Invalid database product price."
                );
            }

            const lineCents = unitCents * item.quantity;

            totalCents += lineCents;

            validatedItems.push({
                productId: product._id.toString(),

                name: selectedOption
                    ? product.name + " - " + selectedOption
                    : product.name,

                option: selectedOption,
                quantity: item.quantity,
                price: unitCents / 100,
                total: lineCents / 100
            });
        }

        // Generate order and pickup timestamps.

        const orderDate = new Date();

        const estimatedReadyAt = new Date(
            orderDate.getTime() +
            PREPARATION_MINUTES * 60 * 1000
        );

        const order = {
            customerName: customerName.trim(),
            phone: phone.trim(),

            email: email ? email.trim() : null,

            specialInstructions:
                specialInstructions
                    ? specialInstructions.trim()
                    : null,

            items: validatedItems,
            orderTotal: totalCents / 100,
            submitted: true,
            status: "Received",
            createdAt: orderDate,
            estimatedReadyAt: estimatedReadyAt,
            paymentStatus: "Not Collected"
        };

        // Save the validated order to MongoDB.

        const result = await database
            .collection("orders")
            .insertOne(order);

        console.log(
            "Smoosh order saved:",
            result.insertedId.toString()
        );

        res.status(201).json({
            message: "Order received successfully.",
            orderId: result.insertedId.toString(),
            orderTotal: order.orderTotal,
            estimatedReadyAt:
                estimatedReadyAt.toISOString()
        });

    } catch (error) {
        console.error("Order submission error:", error);

        res.status(500).json({
            error: "Unable to submit your order."
        });
    }
});

// =========================================
// RETRIEVE SAVED ORDER
// =========================================

app.get("/api/orders/:id", async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!ObjectId.isValid(orderId)) {
            return res.status(400).json({
                error: "Invalid order ID."
            });
        }

        const order = await database
            .collection("orders")
            .findOne({
                _id: new ObjectId(orderId)
            });

        if (!order) {
            return res.status(404).json({
                error: "Order not found."
            });
        }

        res.json(order);

    } catch (error) {
        console.error("Order retrieval error:", error);

        res.status(500).json({
            error: "Unable to retrieve your order."
        });
    }
});

// =========================================
// RETRIEVE APPROVED CUSTOMER REVIEWS
// Project Deliverable 3
// =========================================

app.get("/api/reviews", async (req, res) => {
    try {
        // Only approved feedback is public.

        const reviews = await database
            .collection("reviews")
            .find(
                { approved: true },
                {
                    projection: {
                        customerName: 1,
                        rating: 1,
                        feedback: 1,
                        productName: 1,
                        createdAt: 1
                    }
                }
            )
            .sort({
                createdAt: -1,
                _id: -1
            })
            .limit(50)
            .toArray();

        res.json(reviews);

    } catch (error) {
        console.error("Review retrieval error:", error);

        res.status(500).json({
            error: "Unable to retrieve customer reviews."
        });
    }
});

// =========================================
// SUBMIT CUSTOMER REVIEW
// Project Deliverable 3
// =========================================

app.post("/api/reviews", async (req, res) => {
    try {
        const {
            customerName,
            rating,
            feedback
        } = req.body || {};

        // Validate customer name.

        if (
            typeof customerName !== "string" ||
            !customerName.trim() ||
            customerName.trim().length > 100
        ) {
            return res.status(400).json({
                error: "Please enter a valid customer name."
            });
        }

        // Rating must be an integer from 1 to 5.

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).json({
                error: "Please select a rating from 1 to 5."
            });
        }

        // Validate customer feedback.

        if (
            typeof feedback !== "string" ||
            !feedback.trim() ||
            feedback.trim().length > 2000
        ) {
            return res.status(400).json({
                error:
                    "Please enter feedback between " +
                    "1 and 2000 characters."
            });
        }

        // Store the review using the same
        // data structure established in
        // Assignment 3.

        const review = {
            customerName: customerName.trim(),
            rating: rating,
            feedback: feedback.trim(),
            productName: "Smoosh Food Truck",
            approved: false,
            createdAt: new Date()
        };

        const result = await database
            .collection("reviews")
            .insertOne(review);

        console.log(
            "Smoosh review saved:",
            result.insertedId.toString()
        );

        res.status(201).json({
            message:
                "Thank you! Your review has been " +
                "received and is awaiting approval.",

            reviewId: result.insertedId.toString(),

            approved: false
        });

    } catch (error) {
        console.error("Review submission error:", error);

        res.status(500).json({
            error: "Unable to submit your review."
        });
    }
});

// =========================================
// SERVE EXISTING WEBSITE FILES
// =========================================

// Serve product images from the images folder.

app.use(
    "/images",
    express.static(
        path.join(__dirname, "images")
    )
);

// Serve only known website files.
// Do not expose database exports,
// backend source, or configuration files.

const websiteFiles = [
    "home.html",
    "index.html",
    "cart.html",
    "checkout.html",
    "confirmation.html",
    "reviews.html",
    "style.css",
    "script.js",
    "menu-angular.js"
];

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "home.html")
    );
});

websiteFiles.forEach(filename => {
    app.get("/" + filename, (req, res) => {
        res.sendFile(
            path.join(__dirname, filename)
        );
    });
});

// =========================================
// START SERVER AND CONNECT TO MONGODB
// =========================================

async function startServer() {
    try {
        mongoClient = new MongoClient(MONGO_URL);

        await mongoClient.connect();

        database = mongoClient.db(DATABASE_NAME);

        await database.command({ ping: 1 });

        console.log(
            "Connected to MongoDB database: smoosh"
        );

        app.listen(PORT, "127.0.0.1", () => {
            console.log(
                "Smoosh server running at " +
                `http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Unable to start Smoosh server:",
            error
        );

        process.exit(1);
    }
}

startServer();