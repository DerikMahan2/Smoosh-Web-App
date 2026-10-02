/* =========================================
   SMOOSH FOOD TRUCK
   Assignment 3 JavaScript
   ========================================= */


/* =========================================
   ORDER DATA
   ========================================= */

var orderItems = [];

var orderSubmitted = false;


/* =========================================
   ADD ITEM TO ORDER
   ========================================= */

function addToOrder(productName, price, quantityId) {

    var quantity =
        Number(
            document.getElementById(quantityId).value
        );

    if (quantity < 1) {

        alert("Please select a quantity of at least 1.");

        return;
    }


    var itemTotal =
        calculateTotal(
            price,
            quantity
        );


    var item = {

        name: productName,

        price: price,

        quantity: quantity,

        total: itemTotal

    };


    orderItems.push(item);


    displayOrder();


    alert(
        quantity +
        " " +
        productName +
        " item(s) added to your order."
    );
}


/* =========================================
   CALCULATE ITEM TOTAL
   ========================================= */

function calculateTotal(price, quantity) {

    var total =
        price * quantity;

    return total;
}


/* =========================================
   DISPLAY CURRENT ORDER
   ========================================= */

function displayOrder() {

    var orderSummary =
        document.getElementById(
            "orderSummary"
        );

    var orderTotal =
        document.getElementById(
            "orderTotal"
        );


    if (orderItems.length === 0) {

        orderSummary.innerHTML =
            "<p>Your order is currently empty.</p>";

        orderTotal.innerHTML =
            "<p><strong>Order Total: $0.00</strong></p>";

        return;
    }


    var summaryHTML = "";

    var totalAmount = 0;


    for (
        var i = 0;
        i < orderItems.length;
        i++
    ) {

        summaryHTML +=
            "<p>" +
            "<strong>" +
            orderItems[i].name +
            "</strong>" +
            "<br>" +
            "Quantity: " +
            orderItems[i].quantity +
            "<br>" +
            "Price Each: $" +
            orderItems[i].price.toFixed(2) +
            "<br>" +
            "Item Total: $" +
            orderItems[i].total.toFixed(2) +
            "</p>";


        totalAmount +=
            orderItems[i].total;
    }


    orderSummary.innerHTML =
        summaryHTML;


    orderTotal.innerHTML =
        "<p><strong>Order Total: $" +
        totalAmount.toFixed(2) +
        "</strong></p>";
}


/* =========================================
   CLEAR ORDER
   ========================================= */

function clearOrder() {

    var confirmClear =
        confirm(
            "Are you sure you want to clear your order?"
        );


    if (confirmClear === true) {

        orderItems = [];

        orderSubmitted = false;

        displayOrder();


        document.getElementById(
            "orderMessage"
        ).innerHTML =
            "<p>Your order has been cleared.</p>";
    }
}


/* =========================================
   PRODUCT MOUSE EVENTS
   ========================================= */

function showProductInfo(detailId) {

    var detailBox =
        document.getElementById(
            detailId
        );

    detailBox.style.display =
        "block";
}


function hideProductInfo(detailId) {

    var detailBox =
        document.getElementById(
            detailId
        );

    detailBox.style.display =
        "none";
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


    var orderMessage =
        document.getElementById(
            "orderMessage"
        );


    var hasCustomerName =
        customerName !== "";


    var hasCustomerPhone =
        customerPhone !== "";


    var hasOrderItems =
        orderItems.length > 0;


    var formValid =
        hasCustomerName &&
        hasCustomerPhone &&
        hasOrderItems;


    if (formValid === false) {

        var errorMessage =
            "<h3>Order Not Submitted</h3>";


        if (hasOrderItems === false) {

            errorMessage +=
                "<p>Please add at least one item to your order.</p>";
        }


        if (hasCustomerName === false) {

            errorMessage +=
                "<p>Please enter your name.</p>";
        }


        if (hasCustomerPhone === false) {

            errorMessage +=
                "<p>Please enter your phone number.</p>";
        }


        orderMessage.innerHTML =
            errorMessage;


        return;
    }


    var totalAmount =
        getOrderTotal();


    orderSubmitted =
        true;


    var confirmationHTML =
        "<h3>Order Submitted!</h3>" +
        "<p><strong>Customer:</strong> " +
        customerName +
        "</p>" +
        "<p><strong>Phone:</strong> " +
        customerPhone +
        "</p>";


    if (customerEmail !== "") {

        confirmationHTML +=
            "<p><strong>Email:</strong> " +
            customerEmail +
            "</p>";
    }


    if (specialInstructions !== "") {

        confirmationHTML +=
            "<p><strong>Special Instructions:</strong> " +
            specialInstructions +
            "</p>";
    }


    confirmationHTML +=
        "<p><strong>Order Total:</strong> $" +
        totalAmount.toFixed(2) +
        "</p>" +
        "<p>Your order has been received for pickup.</p>";


    orderMessage.innerHTML =
        confirmationHTML;
}


/* =========================================
   GET FULL ORDER TOTAL
   ========================================= */

function getOrderTotal() {

    var totalAmount =
        0;


    for (
        var i = 0;
        i < orderItems.length;
        i++
    ) {

        totalAmount +=
            orderItems[i].total;
    }


    return totalAmount;
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


    var feedbackValid =
        feedback !== "";


    var ratingValid =
        rating >= 1 &&
        rating <= 5;


    var feedbackFormValid =
        nameValid &&
        feedbackValid &&
        ratingValid;


    if (feedbackFormValid === false) {

        var reviewError =
            "<h3>Feedback Not Submitted</h3>";


        if (nameValid === false) {

            reviewError +=
                "<p>Please enter your name.</p>";
        }


        if (feedbackValid === false) {

            reviewError +=
                "<p>Please enter your feedback.</p>";
        }


        if (ratingValid === false) {

            reviewError +=
                "<p>Please select a valid rating.</p>";
        }


        feedbackMessage.innerHTML =
            reviewError;


        return;
    }


    feedbackMessage.innerHTML =
        "<h3>Thank you for your feedback, " +
        customerName +
        "!</h3>" +
        "<p><strong>Rating:</strong> " +
        rating +
        "/5</p>" +
        "<p><strong>Your Feedback:</strong> " +
        feedback +
        "</p>";
}