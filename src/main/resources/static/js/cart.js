// cart.js - UPDATED with page check
document.addEventListener("DOMContentLoaded", () => {
    // Only run cart loading on the cart page
    if (document.getElementById("cartContent")) {
        loadCart();
    }
    updateCartCount();
});

// --------------------------------------------------
// Load cart - FIXED IMAGE PATH
// --------------------------------------------------
function loadCart() {
    const cartContent = document.getElementById("cartContent");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty_cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items from our menu!</p>
                <a href="/menu" class="continue_shopping_btn">Browse Menu</a>
            </div>
        `;
        return;
    }

    let html = `
        <div class="cart_header">
            <h1>Your Order</h1>
            <p>Review and checkout your items</p>
        </div>
        
        <div class="cart_content">
            <div class="cart_items">
    `;

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        subtotal += itemTotal;

        // FIXED: Use the image path that's already stored in the cart
        let imgPath = item.image || '/uploads/products/no-image.png';

        // Ensure image path is correct
        if (imgPath && !imgPath.startsWith('http') && !imgPath.startsWith('/')) {
            imgPath = '/uploads/products/' + imgPath;
        }

        html += `
            <div class="cart_item" data-index="${index}">
                <div class="cart_item_image">
                    <img src="${imgPath}" 
                         alt="${item.name || 'Product'}"
                         onerror="this.onerror=null; this.src='/uploads/products/no-image.png';">
                </div>
                
                <div class="cart_item_details">
                    <h3 class="cart_item_name">${item.name || 'Unnamed Product'}</h3>
                    <p class="cart_item_price">$${(item.price || 0).toFixed(2)} each</p>
                    
                    <div class="cart_item_controls">
                        <button class="quantity_btn minus" data-index="${index}">-</button>
                        <span class="quantity_display">${item.quantity || 1}</span>
                        <button class="quantity_btn plus" data-index="${index}">+</button>
                        <button class="remove_btn" data-index="${index}">Remove</button>
                    </div>
                </div>
                
                <div class="cart_item_total">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    html += `
            </div>
            
            <div class="cart_summary_card">
                <h2 class="cart_summary_title">Order Summary</h2>
                
                <div class="cart_summary_row">
                    <span class="cart_summary_label">Subtotal:</span>
                    <span class="cart_summary_value">$${subtotal.toFixed(2)}</span>
                </div>
                
                <div class="cart_summary_row">
                    <span class="cart_summary_label">Tax (10%):</span>
                    <span class="cart_summary_value">$${tax.toFixed(2)}</span>
                </div>
                
                <div class="cart_summary_total">
                    <span class="label">Total:</span>
                    <span class="value">$${total.toFixed(2)}</span>
                </div>
                
                <div class="cart_actions">
                    <a href="/menu" class="continue_shopping_btn">Continue Shopping</a>
                    <button class="checkout_btn" id="checkoutBtn">Proceed to Checkout</button>
                    <button class="clear_cart_btn" id="clearCartBtn">Clear Cart</button>
                </div>
            </div>
        </div>
    `;

    cartContent.innerHTML = html;

    // Attach event listeners
    attachCartListeners();
}

// --------------------------------------------------
// Attach cart listeners
// --------------------------------------------------
function attachCartListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.quantity_btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateQuantity(index, -1);
        });
    });

    // Quantity plus buttons
    document.querySelectorAll('.quantity_btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateQuantity(index, 1);
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove_btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeItem(index);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
}

// --------------------------------------------------
// Update quantity
// --------------------------------------------------
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (index >= 0 && index < cart.length) {
        cart[index].quantity = (cart[index].quantity || 1) + change;

        // Remove if quantity is 0 or less
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// --------------------------------------------------
// Remove item
// --------------------------------------------------
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// --------------------------------------------------
// Clear cart
// --------------------------------------------------
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
    }
}

// --------------------------------------------------
// Update cart count - FIXED
// --------------------------------------------------
function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        document.querySelectorAll('#numberItemInCart').forEach(el => {
            el.textContent = totalItems;
        });
    } catch (error) {
        console.error("Error updating cart count:", error);
        document.querySelectorAll('#numberItemInCart').forEach(el => {
            el.textContent = '0';
        });
    }
}

// --------------------------------------------------
// Proceed to checkout
// --------------------------------------------------
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Check authentication
    const isAuthenticated = document.body.getAttribute('data-user-authenticated') === 'true';

    if (!isAuthenticated) {
        // Redirect to login or show login modal
        window.location.href = '/login?redirect=/checkout';
    } else {
        window.location.href = '/checkout';
    }
}

// Make functions available globally
window.updateCartCount = updateCartCount;