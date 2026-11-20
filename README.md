# SMOOSH — Food Truck Web Application

**Burgers. Dogs. Smooshed Right.**  
**Big flavor. Less waiting.**

Smoosh is a food truck business concept based in the Corpus Christi, Texas area. This web application demonstrates an order-ahead experience: customers can explore the menu, build a cart, submit a pickup order, receive an estimated ready time, and leave feedback. The goal is to spend less time waiting in line and more time enjoying the food.

> **Academic prototype:** Smoosh is a proposed business, not an operating ordering service. Orders are for demonstration only; they are not fulfilled, and no online payments are collected.

## Project information

- **Course:** CIDM 6325 — Web Application Development
- **Project:** Deliverable 3
- **Repository:** https://github.com/DerikMahan2/Smoosh-Web-App
- **Deliverable 3 branch:** https://github.com/DerikMahan2/Smoosh-Web-App/tree/project-deliverable-3

## Application features

- **Welcome page:** Introduces Smoosh and explains the value of ordering ahead, with a prominent **Start Your Order** button.
- **Dynamic menu:** Displays product names, descriptions, photos, prices, availability, and categories from the backend. Includes a drink selection where applicable.
- **Cart:** Add items, select quantities, adjust quantities, remove items, and review the total.
- **Checkout:** Enter a name, phone number, optional email, and special instructions; submit a demonstration pickup order.
- **Order confirmation:** Displays a saved order's details, status, estimated ready time, and a reminder that payment was not collected.
- **Reviews:** Displays approved customer reviews and allows new reviews to be submitted for approval.
- **Responsive interface:** Adapts the menu, navigation, and forms for desktop, tablet, and phone layouts.
- **Persistent storage:** Uses MongoDB for products, orders, and reviews.

## Technology stack

| Layer | Technology |
| --- | --- |
| Interface | HTML5, CSS3, JavaScript |
| Dynamic menu | AngularJS |
| Server/API | Node.js and Express |
| Database | MongoDB |
| Database inspection and import/export | MongoDB Compass |
| Version control | Git and GitHub |

## Prerequisites

Install these tools before running the project locally:

1. **Node.js** and npm.
2. **MongoDB Community Server**, running locally, or another MongoDB instance with a suitable connection URI.
3. **MongoDB Compass** (recommended for importing the demonstration data).
4. A modern web browser.

## Run locally

1. Clone the Deliverable 3 branch and open the project folder:

   ```bash
   git clone --branch project-deliverable-3 https://github.com/DerikMahan2/Smoosh-Web-App.git
   cd Smoosh-Web-App
   ```

2. Install the dependencies listed in `package.json`:

   ```bash
   npm install
   ```

3. Start the MongoDB server. The application uses `MONGO_URL` when set and otherwise defaults to:

   ```text
   mongodb://127.0.0.1:27017
   ```

   The database name is `smoosh`.

   **Optional — PowerShell:** To use a different MongoDB URI for the current terminal session:

   ```powershell
   $env:MONGO_URL="mongodb://127.0.0.1:27017"
   ```

4. Import the sample collections using the steps in the next section.

5. Start the web server from the project folder:

   ```bash
   node server.js
   ```

6. Open **http://localhost:3000/** in a browser. The home page introduces the concept; select **Start Your Order** to browse the menu.

   Leave the terminal running while using the app. Press **Ctrl+C** in that terminal to stop the server.

## Import the demonstration database

The repository includes **MongoDB Extended JSON** exports in the `database/` folder:

| File | Collection | Demonstration records |
| --- | --- | ---: |
| `database/smoosh.products.json` | `products` | 7 |
| `database/smoosh.orders.json` | `orders` | 3 |
| `database/smoosh.reviews.json` | `reviews` | 4 |

To import them with MongoDB Compass:

1. Connect Compass to the MongoDB instance used by the application.
2. Create or select the **`smoosh`** database.
3. Create the **`products`**, **`orders`**, and **`reviews`** collections if they do not already exist.
4. Open a collection, select **Add Data → Import JSON or CSV file**, and select the corresponding file from `database/`.
5. Choose **JSON**, complete the import, and repeat for each collection.
6. Confirm that the collections contain the expected records before starting your test.

**Important:** Import into a fresh database or empty collections to avoid duplicate or conflicting sample records. The exported orders and reviews are demonstration data, not real transactions or verified customer testimonials.

## Test the customer experience

1. **Home:** Visit `http://localhost:3000/` and read the introduction and **How Smoosh Works** section.
2. **Menu:** Select **Start Your Order**. View burgers, hot dogs, sides, and drinks; choose quantities and a drink option where applicable.
3. **Cart:** Add products, open the cart, change quantities, and verify that item totals and the overall total update.
4. **Checkout:** Continue to checkout. Confirm the order summary. Test required-field validation, then enter demonstration contact details and submit the order.
5. **Confirmation:** Verify the saved order ID, contents, total, pickup estimate, and **payment not collected** notice.
6. **Database:** Open MongoDB Compass and confirm that the new order appears in `smoosh.orders`.
7. **Reviews:** Visit the Reviews page, submit a test review, and confirm that it is stored in `smoosh.reviews`. New reviews require approval before public display.
8. **Responsive layout:** Repeat the navigation and essential interactions at desktop, tablet, and phone widths using browser developer tools.

You can also visit these backend endpoints while the server is running:

- `http://localhost:3000/api/health` — application and database health.
- `http://localhost:3000/api/products` — product data.
- `http://localhost:3000/api/reviews` — publicly returned reviews.

API endpoints display JSON rather than formatted website pages.

## Project structure

```text
Smoosh-Web-App/
├── database/
│   ├── smoosh.products.json
│   ├── smoosh.orders.json
│   └── smoosh.reviews.json
├── images/                   # Menu product photographs
├── home.html                 # Welcome / landing page
├── index.html                # Menu and product browsing
├── cart.html                 # Shopping cart
├── checkout.html             # Pickup checkout form
├── confirmation.html         # Saved order confirmation
├── reviews.html              # Customer reviews and feedback
├── script.js                 # Shared browser-side behavior
├── menu-angular.js           # AngularJS menu behavior
├── style.css                 # Shared styles and responsive rules
├── server.js                 # Express server and MongoDB integration
├── package.json              # Node dependencies
├── package-lock.json         # Dependency lock file
└── README.md
```

## Scope and limitations

This deliverable demonstrates the customer-facing order-ahead workflow and MongoDB persistence. It **does not** accept payments, dispatch orders to a live food truck, or guarantee a real pickup time. The pickup estimate is for demonstration purposes. Review approval is represented in the stored review data; a separate operational moderation dashboard is not included in this description.

The included database records are **sample data** to help evaluate and reproduce the assignment. No live customer orders should be submitted.

## Troubleshooting

- **The server does not connect to MongoDB:** Verify MongoDB is running and that `MONGO_URL` points to the correct instance. The default is `mongodb://127.0.0.1:27017`.
- **The menu is blank:** Confirm that `smoosh.products` contains the seven sample documents, then refresh the menu page.
- **The site does not open:** Confirm the terminal reports that the server is running and that port `3000` is available.
- **Images are missing:** Confirm the `images/` directory is present and the filenames match the `image` paths in the product records.
- **Changes are not appearing:** Refresh the page, or use a private/incognito window to rule out cached files or prior cart data.

---

*Smoosh — Big flavor. Less waiting.*
