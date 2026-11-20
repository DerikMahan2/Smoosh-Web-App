
/*
=========================================
SMOOSH FOOD TRUCK
Project Deliverable 3
AngularJS 1.x Database-Driven Menu
=========================================
*/

const smooshMenuApp = angular.module(
    "smooshMenuApp",
    []
);

smooshMenuApp.controller(
    "MenuController",
    [
        "$scope",
        "$http",

        function ($scope, $http) {

            // =====================================
            // INITIAL STATE
            // =====================================

            $scope.categories = [];
            $scope.loading = true;
            $scope.errorMessage = "";
            $scope.successMessage = "";

            const categoryOrder = [
                { name: "Burgers", value: "Burger" },
                { name: "Hot Dogs", value: "Hot Dog" },
                { name: "Sides", value: "Side" },
                { name: "Drinks", value: "Drink" }
            ];

            // =====================================
            // RETRIEVE PRODUCTS FROM MONGODB
            // =====================================

            function loadProducts() {

                $scope.loading = true;
                $scope.errorMessage = "";

                $http.get("/api/products").then(

                    function (response) {

                        const products = response.data;

                        if (!Array.isArray(products)) {
                            $scope.errorMessage =
                                "Menu data could not be loaded.";
                            $scope.loading = false;
                            return;
                        }

                        // Set default quantity and
                        // selected option for each product.

                        products.forEach(function (product) {

                            product.quantity = 1;
                            product.selectedOption = "";
                            product.showDetails = false;

                        });

                        // Group products using their
                        // MongoDB category fields.

                        $scope.categories =
                            categoryOrder.map(
                                function (category) {

                                    return {
                                        name: category.name,

                                        items: products.filter(
                                            function (product) {

                                                return (
                                                    product.category ===
                                                    category.value
                                                );

                                            }
                                        )
                                    };
                                }
                            ).filter(
                                function (category) {
                                    return category.items.length > 0;
                                }
                            );

                        $scope.loading = false;

                    },

                    function (error) {

                        console.error(
                            "Smoosh menu loading error:",
                            error
                        );

                        $scope.errorMessage =
                            "Unable to load the menu. " +
                            "Please check the Smoosh server.";

                        $scope.loading = false;

                    }
                );
            }

            // =====================================
            // ADD DATABASE PRODUCT TO CART
            // =====================================

            $scope.addProductToCart = function (product) {

                $scope.errorMessage = "";
                $scope.successMessage = "";

                const quantity = Number(product.quantity);

                // Validate quantity.

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1
                ) {
                    $scope.errorMessage =
                        "Please enter a valid quantity " +
                        "of at least 1.";
                    return;
                }

                // Validate drink selection.

                const hasOptions =
                    Array.isArray(product.options) &&
                    product.options.length > 0;

                if (
                    hasOptions &&
                    !product.options.includes(
                        product.selectedOption
                    )
                ) {
                    $scope.errorMessage =
                        "Please select your drink " +
                        "before adding it to your cart.";
                    return;
                }

                // Use a distinct cart name for
                // each drink selection.

                const cartName = hasOptions
                    ? product.name + " - " +
                      product.selectedOption
                    : product.name;

                const cart = getCart();

                // Find a matching cart line.

                const existingItem = cart.find(
                    function (item) {

                        return item.name === cartName;

                    }
                );

                if (existingItem) {

                    existingItem.quantity += quantity;

                    existingItem.total =
                        Math.round(
                            existingItem.price *
                            existingItem.quantity * 100
                        ) / 100;

                } else {

                    cart.push({
                        productId: product._id,
                        name: cartName,
                        price: Number(product.price),
                        quantity: quantity,
                        total: Math.round(
                            Number(product.price) *
                            quantity * 100
                        ) / 100,
                        option: hasOptions
                            ? product.selectedOption
                            : null
                    });
                }

                // Save using our existing
                // Assignment 3 cart functionality.

                saveCart(cart);

                updateCartStatus();
                updateNavCartCount();

                $scope.successMessage =
                    quantity + " × " + cartName +
                    " added to your cart.";

                // Reset quantity for the next item.

                product.quantity = 1;

                if (hasOptions) {
                    product.selectedOption = "";
                }
            };

            // =====================================
            // INITIALIZE MENU
            // =====================================

            loadProducts();

        }
    ]
);
