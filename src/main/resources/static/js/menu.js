document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
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
// Load menu (PRODUCT-DRIVEN)
// --------------------------------------------------
function loadMenu() {
    fetch("http://localhost:8080/api/admin/products")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load products");
            return res.json();
        })
        .then(products => {
            const categoryMap = {};

            products.forEach(product => {
                const cat = product.category;

                if (!categoryMap[cat.id]) {
                    categoryMap[cat.id] = {
                        id: cat.id,
                        categoryName: cat.categoryName,
                        products: []
                    };
                }

                categoryMap[cat.id].products.push(product);
            });

            renderMenu(Object.values(categoryMap));
        })
        .catch(err => {
            console.error("Menu load error:", err);
            document.getElementById("menuContainer").innerHTML =
                "<p>Failed to load menu</p>";
        });
}

// --------------------------------------------------
// Render menu
// --------------------------------------------------
function renderMenu(categories) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    if (!categories.length) {
        container.innerHTML = "<p>No categories found.</p>";
        return;
    }

    categories.forEach(category => {
        const categoryEl = document.createElement("div");

        categoryEl.innerHTML = `
            <h1>${category.categoryName}</h1>
            <div class="pizza">
                <div class="pizza_menu" id="category-${category.id}"></div>
            </div>
        `;

        container.appendChild(categoryEl);

        const productContainer =
            document.getElementById(`category-${category.id}`);

        if (!category.products.length) {
            productContainer.innerHTML =
                "<p>No products in this category.</p>";
            return;
        }

        category.products.forEach(product => {
            const folder =
                categoryFolderMap[category.categoryName] || "default";
            const img = product.image
                ? `/image/${folder}/${product.image}`
                : `/image/no-image.png`;

            productContainer.innerHTML += `
                <div class="menu">
                    <img src="${img}" width="200" alt="${product.productName}">
                    <div class="info_bar">
                        <p>
                            <b>${product.productName}</b><br>
                            $${product.price}
                        </p>
                        <button class="add-to-cart"
                            data-id="${product.id}"
                            data-name="${product.productName}"
                            data-price="${product.price}"
                            data-image="${product.image || ''}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
        });
    });
}
