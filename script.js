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
   ========================================= */

function displayCart() {

    var cartItems =
        document.getElementById(
            "cartItems"
        );


    var cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (
        cartItems === null ||
        cartTotal === null
    ) {

        return;
    }


    var cart =
        getCart();


    if (
        cart.length === 0
    ) {

        cartItems.innerHTML =
            "<p>Your cart is currently empty.</p>";


        cartTotal.innerHTML =
            "<p><strong>Order Total: $0.00</strong></p>";


        return;
    }


    var cartHTML =
        "";


    for (
        var i = 0;
        i < cart.length;
        i++
    ) {

        cartHTML +=

            "<div class='cart-item'>" +

            "<h3>" +
            cart[i].name +
            "</h3>" +

            "<p>" +

            "<strong>Quantity:</strong> " +
            cart[i].quantity +

            "<br>" +

            "<strong>Price Each:</strong> $" +
            cart[i].price.toFixed(2) +

            "<br>" +

            "<strong>Item Total:</strong> $" +
            cart[i].total.toFixed(2) +

            "</p>" +

            "<button type='button' " +
            "onclick='removeCartItem(" +
            i +
            ")'>" +
            "Remove Item" +
            "</button>" +

            "</div>";
    }


    cartItems.innerHTML =
        cartHTML;


    var total =
        getCartTotal(cart);


    cartTotal.innerHTML =
        "<p><strong>Order Total: $" +
        total.toFixed(2) +
        "</strong></p>";
}


/* =========================================
   REMOVE ONE CART ITEM
   ========================================= */

function removeCartItem(index) {

    var cart =
        getCart();


    cart.splice(
        index,
        1
    );


    saveCart(cart);


    displayCart();
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