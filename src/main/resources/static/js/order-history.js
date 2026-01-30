// order-history.js

document.addEventListener('DOMContentLoaded', function() {
    initOrderHistory();
});

function initOrderHistory() {
    // Search functionality
    const searchInput = document.getElementById('searchOrders');
    if (searchInput) {
        searchInput.addEventListener('input', filterOrders);
    }

    // Modal functionality
    const modal = document.getElementById('orderModal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Attach reorder buttons
    attachReorderListeners();

    // Load order details for view buttons
    attachViewListeners();
}

function filterOrders() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.order-row');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function attachReorderListeners() {
    document.querySelectorAll('.btn-reorder').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            reorderItems(orderId);
        });
    });
}

function attachViewListeners() {
    document.querySelectorAll('.btn-view').forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's a regular link, let it proceed normally
            // We'll handle modal opening in a different way if needed
        });
    });
}

async function reorderItems(orderId) {
    if (!confirm('Add all items from this order to your cart?')) {
        return;
    }

    try {
        // Fetch order details
        const response = await fetch(`/api/orders/${orderId}/items`);

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        const items = await response.json();

        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Add items to cart
        items.forEach(item => {
            const existingItemIndex = cart.findIndex(
                cartItem => cartItem.productId === item.productId
            );

            if (existingItemIndex >= 0) {
                // Update quantity
                cart[existingItemIndex].quantity += item.quantity;
            } else {
                // Add new item
                cart.push({
                    id: item.productId,
                    name: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || '/uploads/products/no-image.png'
                });
            }
        });

        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }

        // Show success message
        showNotification('Items added to cart!', 'success');

        // Optionally redirect to cart
        if (confirm('Items added to cart! View cart now?')) {
            window.location.href = '/cart';
        }

    } catch (error) {
        console.error('Error reordering:', error);
        showNotification('Failed to add items to cart', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0 0 0 10px;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Quick view order details
async function quickViewOrder(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}/details`);
        const order = await response.json();

        // Populate modal
        document.getElementById('orderDetails').innerHTML = generateOrderDetailsHTML(order);

        // Show modal
        document.getElementById('orderModal').style.display = 'flex';

    } catch (error) {
        console.error('Error loading order details:', error);
        showNotification('Failed to load order details', 'error');
    }
}

function generateOrderDetailsHTML(order) {
    return `
        <div class="order-details">
            <div class="detail-header">
                <div class="detail-group">
                    <h3>Order Information</h3>
                    <p><strong>Order #:</strong> ${order.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></p>
                </div>
                
                <div class="detail-group">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Phone:</strong> ${order.customerPhone}</p>
                    <p><strong>Address:</strong> ${order.deliveryAddress}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                </div>
            </div>
            
            <div class="detail-items">
                <h3>Order Items (${order.items.length})</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Subtotal</td>
                            <td>$${order.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Tax (10%)</td>
                            <td>$${order.tax.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3"><strong>Total</strong></td>
                            <td><strong>$${order.total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <div class="detail-actions">
                <button class="btn-print" onclick="printOrder('${order.id}')">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
                <button class="btn-reorder-modal" onclick="reorderItems('${order.id}')">
                    <i class="fas fa-redo"></i> Reorder All
                </button>
            </div>
        </div>
    `;
}

window.quickViewOrder = quickViewOrder;
window.reorderItems = reorderItems;