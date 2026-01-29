// menu.js - FULL FIXED VERSION

document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    updateCartCount();
});

// --------------------------------------------------
// Load menu from API
// --------------------------------------------------
async function loadMenu() {
    const container = document.getElementById("menuContainer");

    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        if (!products || products.length === 0) {
            container.innerHTML = "<p>No products available.</p>";
            return;
        }

        const categoryMap = {};

        products.forEach(product => {
            const categoryName = product.category?.categoryName || "Uncategorized";

            if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = {
                    categoryName: categoryName,
                    products: []
                };
            }

            categoryMap[categoryName].products.push(product);
        });

        renderMenu(Object.values(categoryMap));

    } catch (error) {
        console.error("Menu error:", error);
        container.innerHTML = "<p style='color:red'>Error loading menu.</p>";
    }
}

// --------------------------------------------------
// Render Menu
// --------------------------------------------------
function renderMenu(categories) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    categories.forEach(category => {
        const section = document.createElement("div");
        section.className = "category-section";

        section.innerHTML = `<h1>${category.categoryName}</h1><div class="pizza_menu"></div>`;
        container.appendChild(section);

        const productDiv = section.querySelector(".pizza_menu");
        renderProducts(category.products, productDiv, category.categoryName);
    });
}

// --------------------------------------------------
// Render Products
// --------------------------------------------------
function renderProducts(products, container, categoryName) {

    products.forEach(product => {
        let folder = "pizza";
        if (categoryName.includes("Drink")) folder = "drink";
        if (categoryName.includes("Side")) folder = "side_dishes";

        let imgPath = product.imageUrl
            ? `/image/${folder}/${product.imageUrl}`
            : "/image/no-image.png";

        const div = document.createElement("div");
        div.className = "menu";

        div.innerHTML = `
            <img src="${imgPath}" width="400" 
                 onerror="this.src='/image/no-image.png'">

            <div class="info_bar">
                <p><b>${product.productName}</b><br>$${product.price.toFixed(2)}</p>

                <button class="add-to-cart-btn"
                    data-id="${product.id}"
                    data-name="${product.productName}"
                    data-price="${product.price}"
                    data-image="${product.imageUrl}"
                    data-folder="${folder}">
                    Add to Cart
                </button>
            </div>
        `;

        container.appendChild(div);
    });

    attachCartListeners();
}

// --------------------------------------------------
// Add To Cart Logic
// --------------------------------------------------
function addItemToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Fix image path
    let imagePath = product.image || "/image/no-image.png";
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/")) {
        imagePath = `/image/${product.folder}/${imagePath}`;
    }

    const cartItem = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: imagePath
    };

    const existing = cart.find(item => item.id == cartItem.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCartNotification(cartItem.name + " added to cart!");
}

// --------------------------------------------------
// Button Click Listeners
// --------------------------------------------------
function attachCartListeners() {
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.onclick = function () {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: this.dataset.price,
                image: this.dataset.image,
                folder: this.dataset.folder
            };

            addItemToCart(product);

            // UI effect
            const old = this.innerText;
            this.innerText = "Added!";
            this.style.background = "green";

            setTimeout(() => {
                this.innerText = old;
                this.style.background = "#0b648f";
            }, 1200);
        };
    });
}

// --------------------------------------------------
// Cart Counter
// --------------------------------------------------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + i.quantity, 0);

    document.querySelectorAll("#numberItemInCart").forEach(e => e.textContent = total);
}

// --------------------------------------------------
// Notification Popup
// --------------------------------------------------
function showCartNotification(msg) {
    const div = document.createElement("div");
    div.innerText = msg;
    div.style.cssText = `
        position:fixed; top:80px; right:20px;
        background:#4CAF50; color:white;
        padding:10px 20px; border-radius:6px;
        font-weight:bold; z-index:9999;
    `;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 2000);
}
