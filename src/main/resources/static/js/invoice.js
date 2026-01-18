
// New function to generate printable order
function generatePrintableOrder() {
    const cart = getCart();
    const total = getCartTotal();

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }

    let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Domino's Pizza - Order Receipt</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #333; }
                .receipt-header { text-align: center; margin-bottom: 30px; }
                .receipt-header img { width: 100px; margin-bottom: 10px; }
                .receipt-header h1 { color: #0b648f; margin: 0; font-size: 28px; }
                .receipt-header p { font-size: 14px; color: #555; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f2f2f2; color: #0b648f; }
                .total-row td { font-weight: bold; font-size: 18px; background-color: #e6f7ff; }
                .thank-you { text-align: center; margin-top: 40px; font-size: 16px; color: #0b648f; }
                .note { font-size: 12px; color: #777; text-align: center; margin-top: 10px; }

                @media print {
                    body { -webkit-print-color-adjust: exact; }
                    .receipt-header h1 { color: #0b648f !important; }
                    th { background-color: #f2f2f2 !important; color: #0b648f !important; }
                    .total-row td { background-color: #e6f7ff !important; }
                }
            </style>
        </head>
        <body>
            <div class="receipt-header">
                <img src="image/domino_logo.png" alt="Domino's Logo">
                <h1>Order Receipt</h1>
                <p>Thank you for your order!</p>
                <p>Order Date: ${new Date().toLocaleDateString()}</p>
                <p>Order Time: ${new Date().toLocaleTimeString()}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;

    cart.forEach(item => {
        printContent += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });

    printContent += `
                    <tr class="total-row">
                        <td colspan="3">Total</td>
                        <td>$${total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div class="thank-you">
                We appreciate your business. Enjoy your meal!
            </div>
            <div class="note">
                This is an automated receipt. For any inquiries, please contact us.
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}