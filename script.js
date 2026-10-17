/* =========================================
   SMOOSH FOOD TRUCK
   Assignment 3 JavaScript
   ========================================= */


/* =========================================
   CART STORAGE
   ========================================= */

function getCart() {

    var savedCart =
        localStorage.getItem("smooshCart");


    if (savedCart === null) {

        return [];

    }


    return JSON.parse(savedCart);
}


function saveCart(cart) {

    localStorage.setItem(
        "smooshCart",
        JSON.stringify(cart)
    );
}


/* =========================================
   ADD ITEM TO CART
   ========================================= */

function addToCart(productName, price, quantityId) {

    var quantityInput =
        document.getElementById(quantityId);


    var quantity =
        Number(quantityInput.value);


    if (
        quantity < 1 ||
        Number.isInteger(quantity) === false
    ) {

        alert(
            "Please enter a valid quantity of at least 1."
        );

        return;
    }


    var cart =
        getCart();


    var productFound =
        false;


    for (
        var i = 0;
        i < cart.length;
        i++
    ) {

        if (
            cart[i].name === productName
        ) {

            cart[i].quantity +=
                quantity;


            cart[i].total =
                cart[i].price *
                cart[i].quantity;


            productFound =
                true;
        }
    }


    if (
        productFound === false
    ) {

        var item = {

            name:
                productName,

            price:
                price,

            quantity:
                quantity,

            total:
                price * quantity

        };


        cart.push(item);
    }


    saveCart(cart);


    updateCartStatus();


    alert(
        quantity +
        " " +
        productName +
        " item(s) added to your cart."
    );


    quantityInput.value =
        1;
}


/* =========================================
   PRODUCT MOUSE EVENTS
   ========================================= */

function showProductInfo(detailId) {

    var detailBox =
        document.getElementById(
            detailId
        );


    if (
        detailBox !== null
    ) {

        detailBox.style.display =
            "block";
    }
}


function hideProductInfo(detailId) {

    var detailBox =
        document.getElementById(
            detailId
        );


    if (
        detailBox !== null
    ) {

        detailBox.style.display =
            "none";
    }
}


/* =========================================
   CALCULATE CART TOTAL
   ========================================= */

function getCartTotal(cart) {

    var total =
        0;


    for (
        var i = 0;
        i < cart.length;
        i++
    ) {

        total +=
            cart[i].total;
    }


    return total;
}


/* =========================================
   CALCULATE TOTAL CART ITEMS
   ========================================= */

function getCartItemCount(cart) {

    var itemCount =
        0;


    for (
        var i = 0;
        i < cart.length;
        i++
    ) {

        itemCount +=
            cart[i].quantity;
    }


    return itemCount;
}


/* =========================================
   MENU PAGE CART STATUS
   ========================================= */

function updateCartStatus() {

    var cartStatus =
        document.getElementById(
            "cartStatus"
        );


    if (
        cartStatus === null
    ) {

        return;
    }


    var cart =
        getCart();


    if (
        cart.length === 0
    ) {

        cartStatus.innerHTML =
            "<p>Your cart is currently empty.</p>";

        return;
    }


    var itemCount =
        getCartItemCount(cart);


    var total =
        getCartTotal(cart);


    cartStatus.innerHTML =
        "<p><strong>" +
        itemCount +
        " item(s) in your cart</strong></p>" +
        "<p>Current Total: $" +
        total.toFixed(2) +
        "</p>";
}



/* =========================================
   CART PAGE
   WITH QUANTITY CONTROLS
   ========================================= */

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (cartItems === null || cartTotal === null) {
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

                <h3>${item.name}</h3>

                <p class="cart-unit-price">
                    $${item.price.toFixed(2)} each
                </p>

                <div class="cart-quantity-controls">

                    <span class="cart-quantity-label">
                        Quantity:
                    </span>

                    <button
                        type="button"
                        class="quantity-button"
                        onclick="changeCartQuantity(${i}, -1)"
                        aria-label="Decrease ${item.name} quantity"
                    >
                        &minus;
                    </button>

                    <span class="cart-quantity-value">
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-button"
                        onclick="changeCartQuantity(${i}, 1)"
                        aria-label="Increase ${item.name} quantity"
                    >
                        +
                    </button>

                </div>

                <p class="cart-item-total">
                    Item Total:
                    <strong>$${item.total.toFixed(2)}</strong>
                </p>

                <button
                    type="button"
                    class="remove-item-button"
                    onclick="removeCartItem(${i})"
                >
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
                Order Total: $${total.toFixed(2)}
            </strong>
        </p>
    `;

    updateNavCartCount();
}


/* =========================================
   INCREASE OR DECREASE ITEM QUANTITY
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

    // Adjust the selected product quantity.
    cart[index].quantity += adjustment;

    // Remove the product when quantity reaches zero.
    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    } else {

        // Recalculate this product's subtotal.
        cart[index].total =
            Math.round(
                cart[index].price *
                cart[index].quantity * 100
            ) / 100;
    }

    // Save the updated cart.
    saveCart(cart);

    // Refresh the cart display and totals.
    displayCart();

    // Update homepage summary if present.
    updateCartStatus();
}


/* =========================================
   REMOVE ALL OF A SELECTED PRODUCT
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

    // Delete the entire selected product line.
    cart.splice(index, 1);

    // Save updated shopping cart.
    saveCart(cart);

    // Refresh product list and total.
    displayCart();

    // Refresh homepage summary if present.
    updateCartStatus();
}

/* =========================================
   CONTINUE SHOPPING
   ========================================= */

function continueShopping() {

    window.location.href =
        "index.html";
}


/* =========================================
   CLEAR CART
   ========================================= */

function clearCart() {

    var cart =
        getCart();


    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is already empty."
        );

        return;
    }


    var confirmClear =
        confirm(
            "Are you sure you want to clear your entire order?"
        );


    if (
        confirmClear === true
    ) {

        localStorage.removeItem(
            "smooshCart"
        );


        displayCart();


        var cartMessage =
            document.getElementById(
                "cartMessage"
            );


        if (
            cartMessage !== null
        ) {

            cartMessage.innerHTML =
                "<p>Your order has been cleared.</p>";
        }
    }
}


/* =========================================
   PROCEED TO CHECKOUT
   ========================================= */

function proceedToCheckout() {

    var cart =
        getCart();


    if (
        cart.length === 0
    ) {

        var cartMessage =
            document.getElementById(
                "cartMessage"
            );


        if (
            cartMessage !== null
        ) {

            cartMessage.innerHTML =
                "<h3>Cart Empty</h3>" +
                "<p>Please add at least one item before proceeding to checkout.</p>";
        }


        return;
    }


    window.location.href =
        "checkout.html";
}


/* =========================================
   CHECKOUT SUMMARY
   ========================================= */

function displayCheckoutSummary() {

    var checkoutSummary =
        document.getElementById(
            "checkoutSummary"
        );


    if (
        checkoutSummary === null
    ) {

        return;
    }


    var cart =
        getCart();


    if (
        cart.length === 0
    ) {

        checkoutSummary.innerHTML =
            "<h3>Your Cart Is Empty</h3>" +
            "<p>Please return to the menu and add an item before checking out.</p>";

        return;
    }


    var summaryHTML =
        "<h3>Order Summary</h3>";


    for (
        var i = 0;
        i < cart.length;
        i++
    ) {

        summaryHTML +=

            "<p>" +

            cart[i].quantity +
            " × " +
            cart[i].name +

            " - $" +
            cart[i].total.toFixed(2) +

            "</p>";
    }


    var total =
        getCartTotal(cart);


    summaryHTML +=

        "<p><strong>Order Total: $" +
        total.toFixed(2) +
        "</strong></p>";


    checkoutSummary.innerHTML =
        summaryHTML;
}


/* =========================================
   RETURN TO CART
   ========================================= */

function backToCart() {

    window.location.href =
        "cart.html";
}


/* =========================================
   SUBMIT ORDER
   ========================================= */

function submitOrder() {

    var customerName =
        document.getElementById(
            "customerName"
        ).value.trim();


    var customerPhone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    var customerEmail =
        document.getElementById(
            "customerEmail"
        ).value.trim();


    var specialInstructions =
        document.getElementById(
            "specialInstructions"
        ).value.trim();


    var checkoutMessage =
        document.getElementById(
            "checkoutMessage"
        );


    var cart =
        getCart();


    var hasCustomerName =
        customerName !== "";


    var hasCustomerPhone =
        customerPhone !== "";


    var hasCartItems =
        cart.length > 0;


    var formValid =
        hasCustomerName &&
        hasCustomerPhone &&
        hasCartItems;


    if (
        formValid === false
    ) {

        var errorMessage =
            "<h3>Order Not Submitted</h3>";


        if (
            hasCartItems === false
        ) {

            errorMessage +=
                "<p>Your cart is empty.</p>";
        }


        if (
            hasCustomerName === false
        ) {

            errorMessage +=
                "<p>Please enter your name.</p>";
        }


        if (
            hasCustomerPhone === false
        ) {

            errorMessage +=
                "<p>Please enter your phone number.</p>";
        }


        checkoutMessage.innerHTML =
            errorMessage;


        return;
    }


    var total =
        getCartTotal(cart);


    var emailValue =
        null;


    if (
        customerEmail !== ""
    ) {

        emailValue =
            customerEmail;
    }


    var instructionsValue =
        null;


    if (
        specialInstructions !== ""
    ) {

        instructionsValue =
            specialInstructions;
    }


    var submitted =
        true;


    var order = {

        customerName:
            customerName,

        phone:
            customerPhone,

        email:
            emailValue,

        items:
            cart,

        orderTotal:
            total,

        specialInstructions:
            instructionsValue,

        submitted:
            submitted

    };


    localStorage.setItem(
        "smooshLastOrder",
        JSON.stringify(order)
    );


    localStorage.removeItem(
        "smooshCart"
    );


    window.location.href =
        "confirmation.html";
}


/* =========================================
   ORDER CONFIRMATION PAGE
   ========================================= */

function displayConfirmation() {

    var confirmationDetails =
        document.getElementById(
            "confirmationDetails"
        );


    if (
        confirmationDetails === null
    ) {

        return;
    }


    var savedOrder =
        localStorage.getItem(
            "smooshLastOrder"
        );


    if (
        savedOrder === null
    ) {

        confirmationDetails.innerHTML =
            "<h3>No Recent Order Found</h3>" +
            "<p>Please return to the menu to start a new order.</p>";

        return;
    }


    var order =
        JSON.parse(savedOrder);


    var confirmationHTML =

        "<h3>Thanks, " +
        order.customerName +
        "!</h3>" +

        "<p>Your Smoosh order has been received for pickup.</p>" +

        "<p><strong>Phone:</strong> " +
        order.phone +
        "</p>";


    if (
        order.email !== null
    ) {

        confirmationHTML +=

            "<p><strong>Email:</strong> " +
            order.email +
            "</p>";
    }


    confirmationHTML +=

        "<h3>Order Details</h3>";


    for (
        var i = 0;
        i < order.items.length;
        i++
    ) {

        confirmationHTML +=

            "<p>" +

            order.items[i].quantity +
            " × " +
            order.items[i].name +

            " - $" +
            order.items[i].total.toFixed(2) +

            "</p>";
    }


    confirmationHTML +=

        "<p><strong>Order Total: $" +
        order.orderTotal.toFixed(2) +
        "</strong></p>";


    if (
        order.specialInstructions !== null
    ) {

        confirmationHTML +=

            "<p><strong>Special Instructions:</strong> " +
            order.specialInstructions +
            "</p>";
    }


    confirmationDetails.innerHTML =
        confirmationHTML;
}


/* =========================================
   START NEW ORDER
   ========================================= */

function startNewOrder() {

    localStorage.removeItem(
        "smooshCart"
    );


    localStorage.removeItem(
        "smooshLastOrder"
    );


    window.location.href =
        "index.html";
}


/* =========================================
   REVIEWS PAGE
   ========================================= */

function submitFeedback() {

    var customerName =
        document.getElementById(
            "customerName"
        ).value.trim();


    var rating =
        Number(
            document.getElementById(
                "rating"
            ).value
        );


    var feedback =
        document.getElementById(
            "feedback"
        ).value.trim();


    var feedbackMessage =
        document.getElementById(
            "feedbackMessage"
        );


    var nameValid =
        customerName !== "";


    var ratingValid =
        rating >= 1 &&
        rating <= 5;


    var feedbackValid =
        feedback !== "";


    var formValid =
        nameValid &&
        ratingValid &&
        feedbackValid;


    if (
        formValid === false
    ) {

        var errorMessage =
            "<h3>Feedback Not Submitted</h3>";


        if (
            nameValid === false
        ) {

            errorMessage +=
                "<p>Please enter your name.</p>";
        }


        if (
            ratingValid === false
        ) {

            errorMessage +=
                "<p>Please select a rating.</p>";
        }


        if (
            feedbackValid === false
        ) {

            errorMessage +=
                "<p>Please enter your feedback.</p>";
        }


        feedbackMessage.innerHTML =
            errorMessage;


        return;
    }


    var review = {

        customerName:
            customerName,

        rating:
            rating,

        feedback:
            feedback,

        approved:
            false

    };


    localStorage.setItem(
        "smooshLastReview",
        JSON.stringify(review)
    );


    feedbackMessage.innerHTML =

        "<h3>Thank you for your feedback, " +
        customerName +
        "!</h3>" +

        "<p><strong>Rating:</strong> " +
        rating +
        "/5</p>" +

        "<p><strong>Your Feedback:</strong> " +
        feedback +
        "</p>" +

        "<p>Your review has been received.</p>";


    document.getElementById(
        "customerName"
    ).value =
        "";


    document.getElementById(
        "rating"
    ).value =
        "";


    document.getElementById(
        "feedback"
    ).value =
        "";
}


/* =========================================
   PAGE LOAD
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartStatus();

        displayCart();

        displayCheckoutSummary();

        displayConfirmation();

    }
);


/* =========================================
   PROJECT DELIVERABLE 2
   DYNAMIC NAVIGATION CART COUNTER
   ========================================= */

/*
   Updates the cart quantity displayed in
   the persistent navigation.

   Counts total product quantities, not
   just the number of unique products.
*/

function updateNavCartCount() {

    const cartCountElement =
        document.getElementById("cartCount");

    // Some pages may not have the counter yet.
    if (cartCountElement === null) {
        return;
    }

    // Retrieve cart from localStorage.
    const cart = getCart();

    // Use our existing cart quantity function.
    const totalQuantity = getCartItemCount(cart);

    // Update the navigation text.
    cartCountElement.textContent = totalQuantity;
}


/* =========================================
   UPDATE COUNTER WHEN CART IS SAVED
   ========================================= */

// Preserve the original saveCart function.
const originalSaveCart = saveCart;

// Extend it to refresh the navigation.
saveCart = function(cart) {

    originalSaveCart(cart);

    updateNavCartCount();
};


/* =========================================
   UPDATE COUNTER WHEN CART IS CLEARED
   ========================================= */

// Preserve the original clearCart function.
const originalClearCart = clearCart;

clearCart = function() {

    originalClearCart();

    updateNavCartCount();
};


/* =========================================
   INITIALIZE COUNTER ON PAGE LOAD
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateNavCartCount();

    }
);
