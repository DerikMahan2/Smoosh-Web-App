function calculateTotal(price, quantity) {
    var total = price * quantity;
    return total;
}

function addToOrder(price) {
    var quantity = document.getElementById("quantity").value;

    var total = calculateTotal(price, quantity);

    document.getElementById("orderSummary").innerHTML =
        "<p><strong>Added to Order:</strong> " +
        quantity +
        " The Smoosh burger(s)</p>" +
        "<p><strong>Order Total:</strong> $" +
        total.toFixed(2) +
        "</p>";
}

function submitFeedback() {
    var customerName = document.getElementById("customerName").value;
    var rating = document.getElementById("rating").value;
    var feedback = document.getElementById("feedback").value;

    document.getElementById("feedbackMessage").innerHTML =
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