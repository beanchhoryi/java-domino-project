(() => {
    document.addEventListener('DOMContentLoaded', () => {

        // ------------------------------------------------------------
        // 1. Cart storage
        // ------------------------------------------------------------
        const CART_KEY = 'cart';

        const getCart = () => {
            try {
                return JSON.parse(localStorage.getItem(CART_KEY)) || [];
            } catch {
                return [];
            }
        };

        let cart = getCart();

        const saveCart = () =>
            localStorage.setItem(CART_KEY, JSON.stringify(cart));

        // ------------------------------------------------------------
        // 2. Cart badge
        // ------------------------------------------------------------
        const updateBadge = () => {
            const badge = document.getElementById('numberItemInCart');
            if (badge) badge.textContent = cart.length;
        };

        updateBadge();

        // ------------------------------------------------------------
        // 3. ADD TO CART (EVENT DELEGATION ✅)
        // ------------------------------------------------------------
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart');
            if (!btn) return;

            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const image = btn.dataset.image || '';

            const existing = cart.find(item => item.id === id);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            saveCart();
            updateBadge();
            showToast(`${name} added to cart`);
        });

        // ------------------------------------------------------------
        // 4. Toast
        // ------------------------------------------------------------
        const showToast = (msg) => {
            const toast = document.createElement('div');
            toast.textContent = msg;

            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#003366',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                zIndex: 9999,
                animation: 'toastFade 2s forwards'
            });

            document.body.appendChild(toast);

            if (!document.getElementById('toastAnim')) {
                const style = document.createElement('style');
                style.id = 'toastAnim';
                style.textContent = `
          @keyframes toastFade {
            0%,100% {opacity:0; transform:translateX(-50%) translateY(10px);}
            15%,85% {opacity:1; transform:translateX(-50%) translateY(0);}
          }`;
                document.head.appendChild(style);
            }

            setTimeout(() => toast.remove(), 2000);
        };
    });
})();
