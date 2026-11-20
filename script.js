
/*
=========================================
SMOOSH FOOD TRUCK
Project Deliverable 3
Front-End JavaScript
=========================================

Shopping Cart
Checkout and Order Confirmation
MongoDB-Backed Reviews and Feedback
=========================================
*/


/* =========================================
   SHARED HELPERS
   ========================================= */

function escapeHTML(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        function (character) {
            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return replacements[character];
        }
    );
}

function formatMoney(value) {
    return Number(value).toFixed(2);
}

async function readApiError(response) {
    try {
        const data = await response.json();

        return data.error ||
            "The request could not be completed.";
    } catch (error) {
        return "The request could not be completed.";
    }
}


/* =========================================
   CART STORAGE
   ========================================= */

function getCart() {
    try {
        const savedCart =
            localStorage.getItem("smooshCart");

        if (savedCart === null) {
            return [];
        }

        const cart = JSON.parse(savedCart);

        return Array.isArray(cart) ? cart : [];

    } catch (error) {
        console.error("Cart retrieval error:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(
        "smooshCart",
        JSON.stringify(cart)
    );

    updateNavCartCount();
}


/* =========================================
   ADD ITEM TO CART
   Legacy Assignment 3 Function
   ========================================= */

function addToCart(productName, price, quantityId) {
    const quantityInput =
        document.getElementById(quantityId);

    if (!quantityInput) {
        return;
    }

    const quantity = Number(quantityInput.value);

    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        alert(
            "Please enter a valid quantity of at least 1."
        );
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(
        item => item.name === productName
    );

    if (existingItem) {
        existingItem.quantity += quantity;

        existingItem.total = Math.round(
            existingItem.price *
            existingItem.quantity * 100
        ) / 100;
    } else {
        cart.push({
            name: productName,
            price: Number(price),
            quantity: quantity,
            total: Math.round(
                Number(price) * quantity * 100
            ) / 100
        });
    }

    saveCart(cart);
    updateCartStatus();

    alert(
        quantity + " " + productName +
        " item(s) added to your cart."
    );

    quantityInput.value = 1;
}


/* =========================================
   PRODUCT MOUSE EVENTS
   ========================================= */

function showProductInfo(detailId) {
    const detailBox =
        document.getElementById(detailId);

    if (detailBox) {
        detailBox.style.display = "block";
    }
}

function hideProductInfo(detailId) {
    const detailBox =
        document.getElementById(detailId);

    if (detailBox) {
        detailBox.style.display = "none";
    }
}


/* =========================================
   CART CALCULATIONS
   ========================================= */

function getCartTotal(cart) {
    let total = 0;

    for (const item of cart) {
        total += Number(item.total);
    }

    return Math.round(total * 100) / 100;
}

function getCartItemCount(cart) {
    let count = 0;

    for (const item of cart) {
        count += Number(item.quantity);
    }

    return count;
}


/* =========================================
   NAVIGATION CART COUNTER
   ========================================= */

function updateNavCartCount() {
    const cartCountElement =
        document.getElementById("cartCount");

    if (!cartCountElement) {
        return;
    }

    const cart = getCart();

    cartCountElement.textContent =
        getCartItemCount(cart);
}


/* =========================================
   MENU PAGE CART STATUS
   ========================================= */

function updateCartStatus() {
    const cartStatus =
        document.getElementById("cartStatus");

    if (!cartStatus) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        cartStatus.innerHTML =
            "<p>Your cart is currently empty.</p>";
        return;
    }

    const count = getCartItemCount(cart);
    const total = getCartTotal(cart);

    cartStatus.innerHTML =
        "<p><strong>" +
        count +
        " item(s) in your cart</strong></p>" +
        "<p>Current Total: $" +
        formatMoney(total) +
        "</p>";
}


/* =========================================
   CART PAGE
   ========================================= */

function displayCart() {
    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        cartItems.innerHTML =
            "<p>Your cart is currently empty.</p>";

        cartTotal.innerHTML =
            "<p><strong>Order Total: $0.00</strong></p>";

        updateNavCartCount();
        return;
    }

    let cartHTML = "";

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        cartHTML += `
            <div class="cart-item">

                <h3>${escapeHTML(item.name)}</h3>

                <p class="cart-unit-price">
                    $${formatMoney(item.price)} each
                </p>

                <div class="cart-quantity-controls">

                    <span class="cart-quantity-label">
                        Quantity:
                    </span>

                    <button
                        type="button"
                        class="quantity-button"
                        onclick="changeCartQuantity(${i}, -1)"
                        aria-label="Decrease item quantity">
                        &minus;
                    </button>

                    <span class="cart-quantity-value">
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-button"
                        onclick="changeCartQuantity(${i}, 1)"
                        aria-label="Increase item quantity">
                        +
                    </button>

                </div>

                <p class="cart-item-total">
                    Item Total:
                    <strong>
                        $${formatMoney(item.total)}
                    </strong>
                </p>

                <button
                    type="button"
                    class="remove-item-button"
                    onclick="removeCartItem(${i})">
                    Remove All
                </button>

            </div>
        `;
    }

    cartItems.innerHTML = cartHTML;

    const total = getCartTotal(cart);

    cartTotal.innerHTML = `
        <p>
            <strong>
                Order Total: $${formatMoney(total)}
            </strong>
        </p>
    `;

    updateNavCartCount();
}


/* =========================================
   CHANGE CART ITEM QUANTITY
   ========================================= */

function changeCartQuantity(index, adjustment) {
    const cart = getCart();

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length ||
        (adjustment !== 1 && adjustment !== -1)
    ) {
        return;
    }

    cart[index].quantity += adjustment;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].total = Math.round(
            cart[index].price *
            cart[index].quantity * 100
        ) / 100;
    }

    saveCart(cart);
    displayCart();
    updateCartStatus();
}


/* =========================================
   REMOVE ONE CART LINE
   ========================================= */

function removeCartItem(index) {
    const cart = getCart();

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }

    cart.splice(index, 1);

    saveCart(cart);
    displayCart();
    updateCartStatus();
}


/* =========================================
   CONTINUE SHOPPING
   ========================================= */

function continueShopping() {
    window.location.href = "index.html";
}


/* =========================================
   CLEAR CART
   ========================================= */

function clearCart() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to clear your entire order?"
    );

    if (!confirmClear) {
        return;
    }

    localStorage.removeItem("smooshCart");

    displayCart();
    updateCartStatus();
    updateNavCartCount();

    const cartMessage =
        document.getElementById("cartMessage");

    if (cartMessage) {
        cartMessage.innerHTML =
            "<p>Your order has been cleared.</p>";
    }
}


/* =========================================
   PROCEED TO CHECKOUT
   ========================================= */

function proceedToCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        const cartMessage =
            document.getElementById("cartMessage");

        if (cartMessage) {
            cartMessage.innerHTML =
                "<h3>Cart Empty</h3>" +
                "<p>Please add at least one item " +
                "before proceeding to checkout.</p>";
        }

        return;
    }

    window.location.href = "checkout.html";
}


/* =========================================
   CHECKOUT ORDER SUMMARY
   ========================================= */

function displayCheckoutSummary() {
    const checkoutSummary =
        document.getElementById("checkoutSummary");

    if (!checkoutSummary) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        checkoutSummary.innerHTML =
            "<h3>Your Cart Is Empty</h3>" +
            "<p>Please return to the menu and " +
            "add an item before checking out.</p>";
        return;
    }

    let summaryHTML = "<h3>Order Summary</h3>";

    for (const item of cart) {
        summaryHTML +=
            "<p>" +
            item.quantity +
            " × " +
            escapeHTML(item.name) +
            " - $" +
            formatMoney(item.total) +
            "</p>";
    }

    summaryHTML +=
        "<p><strong>Order Total: $" +
        formatMoney(getCartTotal(cart)) +
        "</strong></p>";

    checkoutSummary.innerHTML = summaryHTML;
}


/* =========================================
   RETURN TO CART
   ========================================= */

function backToCart() {
    window.location.href = "cart.html";
}


/* =========================================
   SUBMIT ORDER TO MONGODB
   Project Deliverable 3
   ========================================= */

let orderSubmissionInProgress = false;

async function submitOrder() {
    if (orderSubmissionInProgress) {
        return;
    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const customerEmail =
        document.getElementById("customerEmail").value.trim();

    const specialInstructions =
        document.getElementById("specialInstructions")
            .value.trim();

    const checkoutMessage =
        document.getElementById("checkoutMessage");

    const cart = getCart();

    if (
        !customerName ||
        !customerPhone ||
        cart.length === 0
    ) {
        let message = "<h3>Order Not Submitted</h3>";

        if (cart.length === 0) {
            message += "<p>Your cart is empty.</p>";
        }

        if (!customerName) {
            message += "<p>Please enter your name.</p>";
        }

        if (!customerPhone) {
            message += "<p>Please enter your phone number.</p>";
        }

        checkoutMessage.innerHTML = message;
        return;
    }

    for (const item of cart) {
        if (!item.productId) {
            checkoutMessage.innerHTML =
                "<h3>Order Not Submitted</h3>" +
                "<p>One or more items need to be " +
                "added again from the updated menu.</p>";
            return;
        }
    }

    const order = {
        customerName: customerName,
        phone: customerPhone,
        email: customerEmail || null,
        specialInstructions:
            specialInstructions || null,

        items: cart.map(function (item) {
            return {
                productId: item.productId,
                quantity: item.quantity,
                option: item.option || null
            };
        })
    };

    const submitButton =
        document.querySelector(
            ".checkout-actions button[onclick='submitOrder()']"
        );

    orderSubmissionInProgress = true;

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
    }

    checkoutMessage.innerHTML =
        "<p>Sending your order to Smoosh...</p>";

    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(
                await readApiError(response)
            );
        }

        const result = await response.json();

        if (!result.orderId) {
            throw new Error(
                "The server did not return an order number."
            );
        }

        localStorage.setItem(
            "smooshLastOrderId",
            result.orderId
        );

        localStorage.removeItem("smooshCart");

        window.location.href =
            "confirmation.html?orderId=" +
            encodeURIComponent(result.orderId);

    } catch (error) {
        console.error(
            "Smoosh order submission error:",
            error
        );

        checkoutMessage.innerHTML =
            "<h3>Order Not Submitted</h3>" +
            "<p>" + escapeHTML(error.message) + "</p>" +
            "<p>Your cart has been preserved. " +
            "Please correct the problem and try again.</p>";

    } finally {
        orderSubmissionInProgress = false;

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Order";
        }
    }
}


/* =========================================
   DATABASE-BACKED CONFIRMATION PAGE
   Project Deliverable 3
   ========================================= */

async function displayConfirmation() {
    const confirmationDetails =
        document.getElementById(
            "confirmationDetails"
        );

    if (!confirmationDetails) {
        return;
    }

    const parameters =
        new URLSearchParams(window.location.search);

    const orderId =
        parameters.get("orderId") ||
        localStorage.getItem("smooshLastOrderId");

    if (!orderId) {
        confirmationDetails.innerHTML =
            "<h3>No Recent Order Found</h3>" +
            "<p>Please return to the menu " +
            "to start a new order.</p>";
        return;
    }

    confirmationDetails.innerHTML =
        "<p>Retrieving your saved Smoosh order...</p>";

    try {
        const response = await fetch(
            "/api/orders/" +
            encodeURIComponent(orderId)
        );

        if (!response.ok) {
            throw new Error(
                await readApiError(response)
            );
        }

        const order = await response.json();

        let confirmationHTML =
            "<h3>Thanks, " +
            escapeHTML(order.customerName) +
            "!</h3>" +

            "<p>Your Smoosh order has been " +
            "received for pickup.</p>" +

            "<p><strong>Order ID:</strong> " +
            escapeHTML(String(order._id)) +
            "</p>" +

            "<p><strong>Status:</strong> " +
            escapeHTML(order.status || "Received") +
            "</p>" +

            "<p><strong>Phone:</strong> " +
            escapeHTML(order.phone) +
            "</p>";

        if (order.email) {
            confirmationHTML +=
                "<p><strong>Email:</strong> " +
                escapeHTML(order.email) +
                "</p>";
        }

        if (order.estimatedReadyAt) {
            const readyDate =
                new Date(order.estimatedReadyAt);

            if (!Number.isNaN(readyDate.getTime())) {
                confirmationHTML +=
                    "<p><strong>Estimated Ready Time:</strong> " +
                    escapeHTML(
                        readyDate.toLocaleTimeString(
                            "en-US",
                            {
                                hour: "numeric",
                                minute: "2-digit"
                            }
                        )
                    ) +
                    "</p>" +

                    "<p><em>Pickup time is an estimate " +
                    "and may change with kitchen demand.</em></p>";
            }
        }

        confirmationHTML +=
            "<h3>Order Details</h3>";

        for (const item of order.items) {
            confirmationHTML +=
                "<p>" +
                item.quantity +
                " × " +
                escapeHTML(item.name) +
                " - $" +
                formatMoney(item.total) +
                "</p>";
        }

        confirmationHTML +=
            "<p><strong>Order Total: $" +
            formatMoney(order.orderTotal) +
            "</strong></p>";

        if (order.specialInstructions) {
            confirmationHTML +=
                "<p><strong>Special Instructions:</strong> " +
                escapeHTML(order.specialInstructions) +
                "</p>";
        }

        confirmationHTML +=
            "<p><strong>Payment:</strong> " +
            "Not collected — demonstration checkout.</p>";

        confirmationDetails.innerHTML =
            confirmationHTML;

    } catch (error) {
        console.error(
            "Confirmation retrieval error:",
            error
        );

        confirmationDetails.innerHTML =
            "<h3>Unable to Load Confirmation</h3>" +
            "<p>" + escapeHTML(error.message) + "</p>" +
            "<p>Your order may have been saved. " +
            "Please verify the order ID before " +
            "placing another order.</p>";
    }
}


/* =========================================
   START NEW ORDER
   ========================================= */

function startNewOrder() {
    localStorage.removeItem("smooshCart");
    localStorage.removeItem("smooshLastOrderId");
    localStorage.removeItem("smooshLastOrder");

    window.location.href = "index.html";
}


/* =========================================
   RETRIEVE APPROVED REVIEWS
   Project Deliverable 3
   ========================================= */

async function loadReviews() {
    const reviewsList =
        document.getElementById("reviewsList");

    if (!reviewsList) {
        return;
    }

    reviewsList.innerHTML =
        "<p>Loading customer reviews...</p>";

    try {
        const response = await fetch("/api/reviews");

        if (!response.ok) {
            throw new Error(
                await readApiError(response)
            );
        }

        const reviews = await response.json();

        if (!Array.isArray(reviews)) {
            throw new Error(
                "The server returned invalid review data."
            );
        }

        if (reviews.length === 0) {
            reviewsList.innerHTML =
                "<p>No approved reviews yet. " +
                "Be the first to share your experience!</p>";
            return;
        }

        let reviewsHTML = "";

        for (const review of reviews) {
            const name = escapeHTML(
                review.customerName || "Smoosh Customer"
            );

            const rating = Number(review.rating);

            const feedback =
                escapeHTML(review.feedback || "");

            const productName = review.productName
                ? escapeHTML(review.productName)
                : "";

            reviewsHTML += `
                <div class="review-card">

                    <h3>${name}</h3>

                    <p class="review-rating">
                        Rating: ${rating}/5
                    </p>

                    ${productName
                        ? `<p><strong>Product:</strong> ${productName}</p>`
                        : ""}

                    <p>${feedback}</p>

                </div>
            `;
        }

        reviewsList.innerHTML = reviewsHTML;

    } catch (error) {
        console.error(
            "Review loading error:",
            error
        );

        reviewsList.innerHTML =
            "<p>Unable to load customer reviews. " +
            "Please try refreshing the page.</p>";
    }
}


/* =========================================
   SUBMIT CUSTOMER FEEDBACK
   Project Deliverable 3
   ========================================= */

let reviewSubmissionInProgress = false;

async function submitFeedback() {
    if (reviewSubmissionInProgress) {
        return;
    }

    const customerName =
        document.getElementById("customerName")
            .value.trim();

    const ratingValue =
        document.getElementById("rating").value;

    const rating = Number(ratingValue);

    const feedback =
        document.getElementById("feedback")
            .value.trim();

    const feedbackMessage =
        document.getElementById("feedbackMessage");

    const submitButton =
        document.getElementById("submitReviewButton");

    // Validate required information.

    const nameValid =
        customerName.length > 0 &&
        customerName.length <= 100;

    const ratingValid =
        ratingValue !== "" &&
        Number.isInteger(rating) &&
        rating >= 1 &&
        rating <= 5;

    const feedbackValid =
        feedback.length > 0 &&
        feedback.length <= 2000;

    if (
        !nameValid ||
        !ratingValid ||
        !feedbackValid
    ) {
        let message =
            "<h3>Feedback Not Submitted</h3>";

        if (!nameValid) {
            message +=
                "<p>Please enter a valid name.</p>";
        }

        if (!ratingValid) {
            message +=
                "<p>Please select a rating from 1 to 5.</p>";
        }

        if (!feedbackValid) {
            message +=
                "<p>Please enter feedback " +
                "between 1 and 2000 characters.</p>";
        }

        feedbackMessage.innerHTML = message;
        return;
    }

    const review = {
        customerName: customerName,
        rating: rating,
        feedback: feedback
    };

    reviewSubmissionInProgress = true;

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
    }

    feedbackMessage.innerHTML =
        "<p>Sending your review to Smoosh...</p>";

    try {
        const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            throw new Error(
                await readApiError(response)
            );
        }

        const result = await response.json();

        feedbackMessage.innerHTML =
            "<h3>Thank You for Your Feedback!</h3>" +
            "<p>Thanks, " +
            escapeHTML(customerName) +
            "!</p>" +
            "<p><strong>Rating:</strong> " +
            rating +
            "/5</p>" +
            "<p>Your review was saved successfully " +
            "and is awaiting approval.</p>";

        // Clear inputs only after confirmed
        // successful database insertion.

        document.getElementById("customerName")
            .value = "";

        document.getElementById("rating")
            .value = "";

        document.getElementById("feedback")
            .value = "";

        // The review remains unapproved and
        // therefore will not yet appear in
        // the public review list.

    } catch (error) {
        console.error(
            "Review submission error:",
            error
        );

        feedbackMessage.innerHTML =
            "<h3>Feedback Not Submitted</h3>" +
            "<p>" +
            escapeHTML(error.message) +
            "</p>" +
            "<p>Your feedback remains in the form. " +
            "Please try again if it was not saved.</p>";

    } finally {
        reviewSubmissionInProgress = false;

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Review";
        }
    }
}


/* =========================================
   PAGE INITIALIZATION
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartStatus();

        displayCart();

        displayCheckoutSummary();

        displayConfirmation();

        updateNavCartCount();

        loadReviews();

    }
);
