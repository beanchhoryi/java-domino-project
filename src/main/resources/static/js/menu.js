document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
});

function loadMenu() {
    fetch("http://localhost:8080/admin/category/api")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load menu");
            return res.json();
        })
        .then(data => renderMenu(data))
        .catch(err => {
            console.error("Menu load error:", err);
            document.getElementById("menuContainer").innerHTML =
                "<p>Failed to load menu</p>";
        });
}

fetch("http://localhost:8080/api/admin/products")
    .then(res => res.json())
    .then(products => {
        const map = {};

        products.forEach(p => {
            const cat = p.category;

            if (!map[cat.id]) {
                map[cat.id] = {
                    id: cat.id,
                    categoryName: cat.categoryName,
                    products: []
                };
            }

            map[cat.id].products.push(p);
        });

        renderMenu(Object.values(map));
    });


function renderMenu(categories) {
    const container = document.getElementById("menuContainer");
    container.innerHTML = "";

    if (!categories || categories.length === 0) {
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

        if (!category.products || category.products.length === 0) {
            productContainer.innerHTML =
                "<p>No products in this category.</p>";
            return;
        }

        category.products.forEach(product => {
            const img = product.image
                ? `/images/products/${product.image}`
                : `/images/no-image.png`;

            productContainer.innerHTML += `
                <div class="menu">
                    <img src="${img}" width="200">
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
