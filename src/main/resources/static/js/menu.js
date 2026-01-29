// menu.js - FIXED image paths
document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    updateCartCount();
});

// ------------------------------------
// Load products from API
// ------------------------------------
async function loadMenu() {
    const container = document.getElementById("menuContainer");

    try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("API error");

        const products = await response.json();
        console.log("Products:", products);

        if (!products || products.length === 0) {
            container.innerHTML = "<p>No products found</p>";
            return;
        }

        // Group by category
        const categoryMap = {};
        products.forEach(p => {
            const cat = p.category?.categoryName || "Uncategorized";
            if (!categoryMap[cat]) categoryMap[cat] = [];
            categoryMap[cat].push(p);
        });

        renderMenu(categoryMap);

    } catch (err) {
        console.error("Menu load failed:", err);
        container.innerHTML = "<p style='color:red'>Failed to load menu</p>";
    }
}

// ------------------------------------
// Render categories
// ------------------------------------
function renderMenu(categoryMap) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    for (let categoryName in categoryMap) {
        const section = document.createElement("div");
        section.className = "category-section";

        section.innerHTML = `
            <h1>${categoryName}</h1>
            <div class="pizza_menu"></div>
        `;

        container.appendChild(section);

        const productContainer = section.querySelector(".pizza_menu");
        renderProducts(categoryMap[categoryName], productContainer, categoryName);
    }
}

// ------------------------------------
// Render products - ADDED categoryName parameter
// ------------------------------------
function renderProducts(products, container, categoryName) {
    products.forEach(product => {
        // Determine correct image path based on your server structure
        let imgPath = "/image/no-image.png"; // Default fallback

        if (product.imageUrl && product.imageUrl.trim() !== "") {
            // Try different possible paths
            if (product.imageUrl.startsWith('http')) {
                imgPath = product.imageUrl;
            } else if (product.imageUrl.includes('/')) {
                imgPath = product.imageUrl;
            } else {
                // Determine folder based on category
                let folder = "pizza";
                if (categoryName.toLowerCase().includes('drink')) {
                    folder = "drink";
                } else if (categoryName.toLowerCase().includes('side')) {
                    folder = "side_dishes";
                }

                // Try different possible paths
                imgPath = `/image/${folder}/${product.imageUrl}`;

                // Also try the uploads path as fallback
                if (!imgPath.includes('.')) {
                    imgPath = `/uploads/products/${product.imageUrl}`;
                }
            }
        }

        const div = document.createElement("div");
        div.className = "menu";

        div.innerHTML = `
            <img src="${imgPath}" 
                 width="400"
                 alt="${product.productName}"
                 onerror="this.src='/image/no-image.png'">

            <div class="info_bar">
                <p>
                    <b>${product.productName}</b><br>
                    $${product.price.toFixed(2)}
                </p>

                <button class="add-to-cart"
                    data-id="${product.id}"
                    data-name="${product.productName}"
                    data-price="${product.price}"
                    data-image="${product.imageUrl}"
                    data-category="${categoryName}">
                    Add to Cart
                </button>
            </div>
        `;

        container.appendChild(div);
    });

    attachCartListeners();
}

// ------------------------------------
// Add to cart button
// ------------------------------------
function attachCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.onclick = function () {
            const category = this.dataset.category || "";

            // Determine folder based on category
            let folder = "pizza";
            if (category.toLowerCase().includes('drink')) {
                folder = "drink";
            } else if (category.toLowerCase().includes('side')) {
                folder = "side_dishes";
            }

            // Store full image path in cart
            let imgPath = '/image/no-image.png';
            if (this.dataset.image && this.dataset.image.trim() !== "") {
                if (this.dataset.image.startsWith('http') || this.dataset.image.includes('/')) {
                    imgPath = this.dataset.image;
                } else {
                    imgPath = `/image/${folder}/${this.dataset.image}`;
                }
            }

            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: imgPath, // Store full path
                folder: folder // Also store folder for reference
            };

            addToCart(product);

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

// ------------------------------------
// Cart logic - FIXED to handle image paths correctly
// ------------------------------------
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id == product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image, // Full path already
            quantity: 1,
            folder: product.folder // Optional: store folder
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// ------------------------------------
// Update cart counter
// ------------------------------------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);

    document.querySelectorAll("#numberItemInCart").forEach(e => e.textContent = total);
}