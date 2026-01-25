function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}
function getToken() {
    return localStorage.getItem('token');
}
function logout() {
    localStorage.removeItem('token');
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/';
}
function checkAuth() {
    if (!isLoggedIn() && window.location.pathname === '/profile') {
        window.location.href = '/login';
        return false;
    }
    return true;
}
function addLogoutButton() {
    if (document.getElementById('logoutBtn')) return;
    const navContainer = document.querySelector('.container_menu_right ul');
    if (!navContainer) return;
    const logoutLi = document.createElement('li');
    logoutLi.innerHTML = `
        <button id="logoutBtn" style="
            background: #e31837;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-right: 10px;
        ">Logout</button>
    `;
    const accountLink = document.getElementById('accountLink');
    const accountLi = accountLink ? accountLink.closest('li') : null;
    if (accountLi && accountLi.parentNode === navContainer) {
        navContainer.insertBefore(logoutLi, accountLi);
    } else {
        navContainer.appendChild(logoutLi);
    }
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}
function updateNavigation() {
    const accountLink = document.getElementById('accountLink');
    if (!accountLink) return;
    if (isLoggedIn()) {
        accountLink.href = '/profile';
        addLogoutButton();
    } else {
        accountLink.href = '/login';
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.closest('li').remove();
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    if (window.location.pathname === '/profile') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('token')) {
            window.history.replaceState({}, '', '/profile');
        } else if (!isLoggedIn()) {
            window.location.href = '/login';
            return;
        }
    }
    if (isLoggedIn()) {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options = {}] = args;
            if (typeof url === 'string' && url.startsWith('/api/')) {
                const newOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${getToken()}`
                    }
                };
                return originalFetch(url, newOptions);
            }
            return originalFetch(...args);
        };
    }
});
document.addEventListener('click', function(e) {
    const accountLink = e.target.closest('#accountLink');
    if (accountLink) {
        e.preventDefault();
        window.location.href = isLoggedIn() ? '/profile' : '/login';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    checkAuth();
});
