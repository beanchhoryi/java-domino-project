// menu.js - UPDATED FOR YOUR EXISTING STYLE
document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    attachCartListeners();
    updateCartCount();
});

// --------------------------------------------------
// Category → folder mapping
// --------------------------------------------------
const categoryFolderMap = {
    "Fast Food": "pizza",
    "Drink": "drink",
    "Side Dish": "side_dishes"
};

// --------------------------------------------------
// Load menu
// --------------------------------------------------
async function loadMenu() {
    const container = document.getElementById("menuContainer");

    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error(`Failed to load products: ${response.status} ${response.statusText}`);
        }

        const products = await response.json();
        console.log("Products loaded:", products);

        if (!products || products.length === 0) {
            container.innerHTML = "<p style='text-align:center; padding:40px;'>No products available at the moment.</p>";
            return;
        }

        const categoryMap = {};

        products.forEach(product => {
            if (product.category) {
                const cat = product.category;
                const categoryName = cat.categoryName || "Uncategorized";

                if (!categoryMap[categoryName]) {
                    categoryMap[categoryName] = {
                        id: cat.id || categoryName.toLowerCase().replace(/\s+/g, '-'),
                        categoryName: categoryName,
                        products: []
                    };
                }

                categoryMap[categoryName].products.push(product);
            } else {
                if (!categoryMap["uncategorized"]) {
                    categoryMap["uncategorized"] = {
                        id: "uncategorized",
                        categoryName: "Uncategorized",
                        products: []
                    };
                }
                categoryMap["uncategorized"].products.push(product);
            }
        });

        renderMenu(Object.values(categoryMap));
    } catch (error) {
        console.error("Menu load error:", error);

        // Fallback to sample data if API fails
        renderSampleMenu();
    }
}

// --------------------------------------------------
// Fallback sample menu
// --------------------------------------------------
function renderSampleMenu() {
    const sampleCategories = [
        {
            id: "pizzas",
            categoryName: "Pizzas",
            products: [
                { id: 1, productName: "Cheese Pizza", price: 8.99, imageUrl: "cheese.jpg" },
                { id: 2, productName: "Pepperoni Pizza", price: 9.99, imageUrl: "pepperoni.jpg" },
                { id: 3, productName: "Veggie Pizza", price: 10.99, imageUrl: "veggie.jpg" },
                { id: 4, productName: "Meat Lovers", price: 12.99, imageUrl: "meat-lovers.jpg" },
                { id: 5, productName: "Hawaiian Pizza", price: 11.99, imageUrl: "hawaiian.jpg" },
                { id: 6, productName: "BBQ Chicken Pizza", price: 13.99, imageUrl: "bbq-chicken.jpg" }
            ]
        },
        {
            id: "drinks",
            categoryName: "Drinks",
            products: [
                { id: 7, productName: "Coca Cola", price: 1.99, imageUrl: "coke.jpg" },
                { id: 8, productName: "Orange Juice", price: 2.49, imageUrl: "juice.jpg" },
                { id: 9, productName: "Iced Tea", price: 1.79, imageUrl: "iced-tea.jpg" },
                { id: 10, productName: "Mineral Water", price: 1.00, imageUrl: "water.jpg" }
            ]
        },
        {
            id: "side-dishes",
            categoryName: "Side Dishes",
            products: [
                { id: 11, productName: "Garlic Bread", price: 3.99, imageUrl: "garlic-bread.jpg" },
                { id: 12, productName: "Chicken Wings", price: 6.99, imageUrl: "wings.jpg" },
                { id: 13, productName: "French Fries", price: 2.99, imageUrl: "fries.jpg" },
                { id: 14, productName: "Salad", price: 4.99, imageUrl: "salad.jpg" }
            ]
        }
    ];

    renderMenu(sampleCategories);
}

// --------------------------------------------------
// Render menu - USING YOUR EXISTING CSS STRUCTURE
// --------------------------------------------------
function renderMenu(categories) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    if (!categories || categories.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No categories found.</p>";
        return;
    }

    categories.forEach(category => {
        // Create category section with your existing h1 style
        const categorySection = document.createElement("div");
        categorySection.className = "category-section";

        // Create the h1 with your exact style
        const categoryTitle = document.createElement("h1");
        categoryTitle.textContent = category.categoryName;

        // Create the pizza menu container
        const pizzaMenuDiv = document.createElement("div");
        pizzaMenuDiv.className = "pizza_menu";
        pizzaMenuDiv.id = `category-${category.id}`;

        // Append to container
        categorySection.appendChild(categoryTitle);
        categorySection.appendChild(pizzaMenuDiv);
        container.appendChild(categorySection);

        // Render products for this category
        renderProducts(category.products, pizzaMenuDiv);
    });
}

// --------------------------------------------------
// Render products in your exact HTML structure
// --------------------------------------------------
function renderProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>No products in this category.</p>";
        return;
    }

    products.forEach(product => {
        // Determine folder based on category name
        let folder = "pizza"; // default

        // Check category name to determine folder
        const categoryName = container.closest('.category-section')?.querySelector('h1')?.textContent || "";

        if (categoryName.includes("Drink")) {
            folder = "drink";
        } else if (categoryName.includes("Side")) {
            folder = "side_dishes";
        } else {
            folder = "pizza"; // For Fast Food/Pizzas
        }

        // Build image path
        let imgPath;
        if (product.imageUrl) {
            if (product.imageUrl.startsWith('http')) {
                imgPath = product.imageUrl;
            } else if (product.imageUrl.includes('/')) {
                imgPath = product.imageUrl;
            } else {
                imgPath = `/image/${folder}/${product.imageUrl}`;
            }
        } else {
            imgPath = '/image/no-image.png';
        }

        // Create the exact HTML structure your CSS expects
        const productDiv = document.createElement("div");
        productDiv.className = "menu";
        productDiv.innerHTML = `
            <img src="${imgPath}" 
                 width="400" 
                 alt="${product.productName}"
                 onerror="this.onerror=null; this.src='/image/no-image.png';">
            <div class="info_bar">
                <p>
                    <b>${product.productName}</b><br>
                    $${product.price ? product.price.toFixed(2) : '0.00'}
                </p>
                <button class="add-to-cart"
                    data-id="${product.id}"
                    data-name="${product.productName}"
                    data-price="${product.price || 0}"
                    data-image="${product.imageUrl || ''}">
                    Add to Cart
                </button>
            </div>
        `;
        container.appendChild(productDiv);
    });
}

// --------------------------------------------------
// Attach cart event listeners
// --------------------------------------------------
function attachCartListeners() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const product = {
                id: button.getAttribute('data-id'),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image'),
                quantity: 1
            };

            addToCart(product);

            // Visual feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.backgroundColor = '#4CAF50';
            button.style.boxShadow = '1px 1px 7px 0.09px #2e7d32';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#0b648f';
                button.style.boxShadow = '1px 1px 7px 0.09px #951024';
            }, 1500);
        }
    });
}

// --------------------------------------------------
// Cart functions
// --------------------------------------------------
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show notification
    showCartNotification(`${product.name} added to cart!`);
}

function showCartNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update cart count in all elements with this ID
    document.querySelectorAll('#numberItemInCart').forEach(el => {
        el.textContent = totalItems;
    });
}

// --------------------------------------------------
// Responsive grid adjustment
// --------------------------------------------------
function adjustGridForResponsive() {
    const pizzaMenus = document.querySelectorAll('.pizza_menu');
    pizzaMenus.forEach(menu => {
        const containerWidth = menu.parentElement.offsetWidth;

        if (containerWidth < 1300) {
            menu.style.gridTemplateColumns = 'repeat(2, 1fr)';
            menu.style.marginLeft = '50%';
        } else {
            menu.style.gridTemplateColumns = 'repeat(3, 400px)';
            menu.style.marginLeft = '40%';
        }

        if (containerWidth < 900) {
            menu.style.gridTemplateColumns = '1fr';
            menu.style.marginLeft = '0';
            menu.style.transform = 'translateX(0)';
        }
    });
}

// Run on load and resize
window.addEventListener('load', adjustGridForResponsive);
window.addEventListener('resize', adjustGridForResponsive);