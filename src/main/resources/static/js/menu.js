// menu.js - UPDATED: Everyone can access menu
document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    updateCartCount();
});

// ------------------------------------
// Load products from API - UPDATED: No role check needed
// ------------------------------------
async function loadMenu() {
    const container = document.getElementById("menuContainer");

    try {
        // Try to get token for authentication
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch("/api/products/public", {
            headers: headers
        });

        if (!response.ok) {
            throw new Error("Failed to load menu");
        }

        const products = await response.json();
        console.log("Products:", products);

        if (!products || products.length === 0) {
            container.innerHTML = "<p>No products available at the moment.</p>";
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
        container.innerHTML = "<p style='color:red'>Failed to load menu. Please try again later.</p>";
    }
}

// ------------------------------------
// Render categories - SAME
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
// Render products - SAME
// ------------------------------------
function renderProducts(products, container, categoryName) {
    products.forEach(product => {
        let imgPath = "/image/no-image.png";

        if (product.imageUrl && product.imageUrl.trim() !== "") {
            if (product.imageUrl.startsWith('http')) {
                imgPath = product.imageUrl;
            } else if (product.imageUrl.includes('/')) {
                imgPath = product.imageUrl;
            } else {
                let folder = "pizza";
                if (categoryName.toLowerCase().includes('drink')) {
                    folder = "drink";
                } else if (categoryName.toLowerCase().includes('side')) {
                    folder = "side_dishes";
                }

                imgPath = `/image/${folder}/${product.imageUrl}`;

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
             style="object-fit: cover; height: 250px;"
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
// Add to cart button - SAME
// ------------------------------------
function attachCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.onclick = function () {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to add items to cart!");
                window.location.href = '/login';
                return;
            }

            const category = this.dataset.category || "";

            let folder = "pizza";
            if (category.toLowerCase().includes('drink')) {
                folder = "drink";
            } else if (category.toLowerCase().includes('side')) {
                folder = "side_dishes";
            }

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
                image: imgPath,
                folder: folder
            };

            addToCart(product);

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
// Cart logic - SAME
// ------------------------------------
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Product should have these properties from backend:
    // id, productName, price, imageUrl, etc.

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.productName || product.name, // Use productName from backend
            price: product.price,
            quantity: 1,
            image: product.imageUrl || product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// ------------------------------------
// Update cart counter - SAME
// ------------------------------------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);

    document.querySelectorAll("#numberItemInCart").forEach(e => e.textContent = total);
}