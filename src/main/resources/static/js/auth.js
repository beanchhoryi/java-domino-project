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

function updateNavigation() {
    const accountLink = document.getElementById('accountLink');
    if (!accountLink) return;

    if (isLoggedIn()) {
        accountLink.href = '/profile';
    } else {
        accountLink.href = '/login';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateNavigation();
    checkAuth();

    if (isLoggedIn()) {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            const [url, options = {}] = args;
            if (typeof url === 'string' && url.startsWith('/api/')) {
                return originalFetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${getToken()}`
                    }
                });
            }
            return originalFetch(url, options);
        };
    }
});

document.addEventListener('click', function (e) {
    const accountLink = e.target.closest('#accountLink');
    if (accountLink) {
        e.preventDefault();
        window.location.href = isLoggedIn() ? '/profile' : '/login';
    }
});
