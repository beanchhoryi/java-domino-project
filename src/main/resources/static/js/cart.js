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
        // Redirect to login
        window.location.href = '/login?redirect=/checkout';
        return;
    }

    // Generate and show checkout modal
    showCheckoutModal();
}

// --------------------------------------------------
// Show checkout modal - ADD THIS FUNCTION (pure JavaScript)
// --------------------------------------------------
function showCheckoutModal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let subtotal = 0;
    let itemsHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        subtotal += itemTotal;

        itemsHTML += `
            <div class="checkout_item">
                <span class="checkout_item_name">${item.name || 'Product'}</span>
                <span class="checkout_item_qty">${item.quantity || 1} x $${(item.price || 0).toFixed(2)}</span>
                <span class="checkout_item_total">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Create modal HTML with inline styles (no CSS file needed)
    const modalHTML = `
    <div id="checkoutModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;padding:20px;">
        <div style="background:white;border-radius:10px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:20px;background:#0b648f;color:white;border-radius:10px 10px 0 0;">
                <h2 style="margin:0;font-size:22px;">Order Checkout</h2>
                <button onclick="closeCheckoutModal()" style="background:none;border:none;color:white;font-size:28px;cursor:pointer;padding:0;width:30px;height:30px;line-height:30px;">&times;</button>
            </div>
            
            <div style="padding:25px;">
                <div style="margin-bottom:25px;">
                    <h3 style="color:#0b648f;margin-bottom:15px;padding-bottom:10px;border-bottom:2px solid #f0f0f0;">Order Summary</h3>
                    <div style="max-height:200px;overflow-y:auto;margin-bottom:20px;">
                        ${itemsHTML}
                    </div>
                    <div style="background:#f8f9fa;padding:15px;border-radius:8px;border:1px solid #e9ecef;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                            <span>Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                            <span>Tax (10%):</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:20px;color:#e21737;padding-top:10px;border-top:2px solid #ddd;">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin:25px 0;">
                    <h3 style="color:#0b648f;margin-bottom:15px;padding-bottom:10px;border-bottom:2px solid #f0f0f0;">Customer Info</h3>
                    <div style="display:grid;gap:15px;">
                        <input type="text" id="customerName" placeholder="Full Name *" style="width:100%;padding:12px 15px;border:1px solid #ddd;border-radius:6px;font-size:16px;" required>
                        <input type="tel" id="customerPhone" placeholder="Phone Number *" style="width:100%;padding:12px 15px;border:1px solid #ddd;border-radius:6px;font-size:16px;" required>
                        <textarea id="customerAddress" placeholder="Delivery Address *" rows="3" style="width:100%;padding:12px 15px;border:1px solid #ddd;border-radius:6px;font-size:16px;resize:vertical;" required></textarea>
                    </div>
                </div>
                
                <div style="display:flex;gap:15px;margin-top:30px;">
                    <button onclick="closeCheckoutModal()" style="flex:1;padding:15px;background:#6c757d;color:white;border:none;border-radius:6px;font-size:16px;cursor:pointer;">Cancel</button>
                    <button onclick="confirmCheckout()" style="flex:2;padding:15px;background:#e21737;color:white;border:none;border-radius:6px;font-size:16px;font-weight:bold;cursor:pointer;">Place Order</button>
                </div>
                
                <div style="margin-top:20px;padding:10px;background:#fff8e1;border-radius:6px;border-left:4px solid #ffc107;text-align:center;">
                    <p style="margin:0;color:#856404;font-size:13px;">By confirming, you agree to our terms. Delivery within 30 minutes.</p>
                </div>
            </div>
        </div>
    </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add inline styles for checkout items
    const style = document.createElement('style');
    style.textContent = `
        .checkout_item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        .checkout_item:last-child {
            border-bottom: none;
        }
        .checkout_item_name {
            flex: 2;
            font-weight: 600;
        }
        .checkout_item_qty {
            flex: 1;
            text-align: center;
            color: #666;
        }
        .checkout_item_total {
            flex: 1;
            text-align: right;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// --------------------------------------------------
// Close checkout modal - ADD THIS FUNCTION
// --------------------------------------------------
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.remove();
    }
    // Remove the style element we added
    const style = document.querySelector('style[data-checkout-style]');
    if (style) {
        style.remove();
    }
    // Restore scrolling
    document.body.style.overflow = 'auto';
}

// --------------------------------------------------
// Confirm checkout - ADD THIS FUNCTION
// --------------------------------------------------
function confirmCheckout() {
    const name = document.getElementById('customerName')?.value;
    const phone = document.getElementById('customerPhone')?.value;
    const address = document.getElementById('customerAddress')?.value;

    if (!name || !phone || !address) {
        alert('Please fill in all required fields (Name, Phone, Address)');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is already empty!');
        closeCheckoutModal();
        return;
    }

    let subtotal = 0;
    let itemsHTML = '';

    cart.forEach(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        subtotal += itemTotal;

        itemsHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Generate printable receipt
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Domino's Pizza - Order Receipt</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
            .receipt { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0b648f; padding-bottom: 20px; }
            .header h1 { color: #0b648f; margin: 10px 0; }
            .customer { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #0b648f; color: white; }
            .total-row { font-weight: bold; background: #f0f8ff; }
            .thank-you { text-align: center; margin-top: 40px; color: #0b648f; padding-top: 20px; border-top: 2px solid #0b648f; }
        </style>
    </head>
    <body>
        <div class="receipt">
            <div class="header">
                <h1>Domino's Pizza</h1>
                <p><strong>Order Receipt</strong></p>
                <p>${new Date().toLocaleDateString()} • ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div class="customer">
                <p><strong>Customer:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Address:</strong> ${address}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="3">Subtotal</td>
                        <td>$${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3">Tax (10%)</td>
                        <td>$${tax.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3"><strong>TOTAL</strong></td>
                        <td><strong>$${total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="thank-you">
                <p><strong>Thank you for your order!</strong></p>
                <p>Delivery within 30 minutes</p>
                <p>Order ID: DOM-${Date.now().toString().slice(-6)}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Auto print after short delay
    setTimeout(() => {
        try {
            printWindow.print();

            // Handle different browser behaviors
            if (printWindow.matchMedia) {
                printWindow.matchMedia('print').addListener(function(mql) {
                    if (!mql.matches) {
                        // Print dialog closed
                        completeOrder();
                    }
                });
            }

            // Fallback timer for browsers that don't support print event
            setTimeout(completeOrder, 1000);

        } catch (error) {
            console.error('Print error:', error);
            // Even if print fails, complete the order
            completeOrder();
        }
    }, 500);

    // Function to complete the order after printing
    function completeOrder() {
        try {
            // Clear cart from localStorage
            localStorage.removeItem('cart');

            // Update cart count
            updateCartCount();

            // Close modal
            closeCheckoutModal();

            // Show success message
            alert('🎉 Order confirmed successfully!\n\nThank you for your order. Your food will be delivered within 30 minutes.\nOrder ID: DOM-' + Date.now().toString().slice(-6));

            // Reload cart page if we're on it
            if (document.getElementById("cartContent")) {
                loadCart();
            }

            // Close print window
            if (printWindow && !printWindow.closed) {
                printWindow.close();
            }

        } catch (error) {
            console.error('Error completing order:', error);
            alert('Order placed but there was an error clearing the cart. Please refresh the page.');
        }
    }
}

// Make functions available globally
window.updateCartCount = updateCartCount;