let cartInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
    if (cartInitialized) return;
    cartInitialized = true;

    updateCartCount();

    // Show cart items only on cart page
    if (window.location.pathname.includes('cart') || window.location.pathname.includes('carts')) {
        displayCartItems();
    }

    setupCartButtons();
});

function setupCartButtons() {
    document.removeEventListener('click', handleAddToCartClick);
    document.addEventListener('click', handleAddToCartClick);
}

function handleAddToCartClick(e) {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;

    e.preventDefault();

    const id = button.dataset.id;
    const name = button.dataset.name?.trim();
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image || '';

    if (!id || !name || isNaN(price)) {
        console.error('Missing product data on button:', button);
        return;
    }

    addToCart(id, name, price, image);
}

function addToCart(id, name, price, image = '') {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1,
            image: image || 'images/no-image.png'
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartMessage(name);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('numberItemInCart');
    if (counter) counter.textContent = count;
}
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('.body_container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items to get started!</p>
                <button class="continue-shopping" onclick="window.location.href = window.URLS.menu">Start Order Here</button>
            </div>`;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let html = `
        <div class="cart-container">
            <h1>Your Cart</h1>
            <div class="cart-items">
    `;

    cart.forEach(item => {
    // Fix image path if it's relative
    let imagePath = item.image;
    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        // If it's a relative path like "image/side_dishes/nugget.png"
        imagePath = `/static/${imagePath}`;
    }

    html += `
        <div class="cart-item" style="display:flex; align-items:center; gap:20px; padding:15px; border-bottom:1px solid #eee;">
            ${imagePath ? `<img src="${imagePath}" alt="${item.name}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">` : ''}
            <div class="item-info" style="flex-grow: 1;">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
                <div class="item-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
            <div class="item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `;
});

    html += `
            </div>
            <div class="cart-summary">
                <div class="total-section">
                    <h2>Total: $${total.toFixed(2)}</h2>
                    <div class="cart-actions">
                        <button class="continue-shopping" onclick="window.location.href = window.URLS.menu">
                            Continue Shopping
                        </button>
                        <button class="checkout-btn" onclick="checkout()">
                            Proceed to Checkout
                        </button>
                        <button class="clear-cart-btn" onclick="clearCart()">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function clearCart() {
    if (!confirm('Clear entire cart?')) return;
    localStorage.removeItem('cart');
    updateCartCount();
    displayCartItems();
}

function showAddToCartMessage(name) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.style.cssText = `
            position:fixed; top:80px; right:5px; background:#28a745; color:white;
            padding:16px 24px; border-radius:8px; z-index:10000; font-weight:bold;
            box-shadow:0 4px 12px rgba(0,0,0,0.2); transform:translateX(400px); transition:0.4s;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = `${name} added to cart!`;
    toast.style.transform = 'translateX(0)';
    setTimeout(() => toast.style.transform = 'translateX(400px)', 3000);
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const isLoggedIn = document.body.dataset.userAuthenticated === 'true';
    // Check for login first before allowed to checkout
    if (!isLoggedIn) {
        localStorage.setItem('checkout_intent', 'true');

        localStorage.setItem('redirect_after_login', window.location.pathname);

        alert('Please log in to complete your order.');
        window.location.href = '/login/';
        return;
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;

    try {
        const response = await fetch('/create-invoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ cart })
        });

        const data = await response.json();

        if (response.ok) {
            generatePrintableOrder(data.invoice_id);
            localStorage.removeItem('cart');
            localStorage.removeItem('checkout_intent');
            updateCartCount();
            alert(data.message || 'Order placed successfully!');
            window.location.href = '/';
        } else {
            throw new Error(data.error || 'Checkout failed');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error: ' + error.message);
    } finally {
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }
}

// Helper function to get CSRF token (if needed)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ——— PRINTABLE RECEIPT ———
function generatePrintableOrder(invoiceId = null) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    let html = `
    <!DOCTYPE html>
    <html><head><title>Domino's Order Receipt</title>
    <style>
        body{font-family:Arial,sans-serif;margin:40px;line-height:1.6;color:#333;}
        .header{text-align:center;margin-bottom:40px;}
        .header img{width:100px;}
        h1{color:#0b648f;}
        table{width:100%;border-collapse:collapse;margin:30px 0;}
        th,td{border:1px solid #ddd;padding:12px;text-align:left;}
        th{background:#f0f0f0;color:#0b648f;}
        .total{font-weight:bold;font-size:1.2em;background:#e6f7ff;}
        .footer{text-align:center;margin-top:50px;color:#0b648f;}
        @media print{ body{margin:10mm;} }
    </style>
    </head><body>
    <div class="header">
        <img src="{% static 'image/domino_logo.png' %}" alt="Domino's">
        <h1>Order Receipt</h1>
        ${invoiceId ? `<p><strong>Order #${invoiceId}</strong></p>` : ''}
        <p>Thank you for your order!</p>
        <p>${new Date().toLocaleString()}</p>
    </div>
    <table>
        <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>`;

    cart.forEach(i => {
        html += `<tr><td>${i.name}</td><td>$${i.price.toFixed(2)}</td><td>${i.quantity}</td><td>$${(i.price*i.quantity).toFixed(2)}</td></tr>`;
    });

    html += `
        <tr class="total"><td colspan="3">TOTAL</td><td>$${total.toFixed(2)}</td></tr>
        </tbody>
    </table>
    <div class="footer">
        <p>Enjoy your meal! See you again soon!</p>
    </div>
    </body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
}