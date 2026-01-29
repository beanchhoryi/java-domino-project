document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    loadCartPage();
});

// --------------------------------------------------
function loadCartPage() {
    const container = document.getElementById("cartContent");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty_cart">
                <h2>Your cart is empty</h2>
                <a href="/menu" class="continue_shopping_btn">Go Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let itemsHTML = "";

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        itemsHTML += `
        <div class="cart_item">
            <div class="cart_item_image">
                <img src="${item.image}" onerror="this.src='/image/no-image.png'">
            </div>

            <div class="cart_item_details">
                <div class="cart_item_name">${item.name}</div>
                <div class="cart_item_price">$${item.price}</div>

                <div class="cart_item_controls">
                    <button class="quantity_btn" onclick="changeQty('${item.id}',-1)">-</button>
                    <span class="quantity_display">${item.quantity}</span>
                    <button class="quantity_btn" onclick="changeQty('${item.id}',1)">+</button>
                    <button class="remove_btn" onclick="removeItem('${item.id}')">Remove</button>
                </div>
            </div>

            <div class="cart_item_total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        `;
    });

    const delivery = 2.99;
    const tax = subtotal * 0.1;
    const total = subtotal + delivery + tax;

    container.innerHTML = `
        <div class="cart_header"><h1>Your Cart</h1></div>
        <div class="cart_content">
            <div class="cart_items">${itemsHTML}</div>

            <div class="cart_summary_card">
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <p>Delivery: $${delivery}</p>
                <p>Tax: $${tax.toFixed(2)}</p>
                <h2>Total: $${total.toFixed(2)}</h2>

                <button class="checkout_btn" onclick="checkout()">Checkout</button>
                <button class="clear_cart_btn" onclick="clearCart()">Clear Cart</button>
            </div>
        </div>
    `;
}

// --------------------------------------------------
function changeQty(id, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => i.id == id);

    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(i => i.id != id);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCartPage();
}

// --------------------------------------------------
function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(i => i.id != id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCartPage();
}

// --------------------------------------------------
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    loadCartPage();
}

// --------------------------------------------------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll("#numberItemInCart").forEach(e => e.textContent = total);
}

// --------------------------------------------------
function checkout() {
    alert("Checkout success (demo)");
    clearCart();
}
