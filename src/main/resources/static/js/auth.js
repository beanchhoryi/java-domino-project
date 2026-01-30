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

function getUserRole() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        return null;
    }
}

function updateRoleLinks() {
    const token = getToken();
    const role = getUserRole();

    const dashboardLinks = document.querySelectorAll('a[href="/dashboard"]');
    if (dashboardLinks.length) {
        if (role !== 'ROLE_ADMIN') {
            dashboardLinks.forEach(el => el.style.display = 'none');
        } else {
            dashboardLinks.forEach(el => el.style.display = '');
        }
    }

    // Show/hide profile links based on login status
    const profileLinks = document.querySelectorAll('a[href="/profile"]');
    if (profileLinks.length) {
        if (!token) {
            profileLinks.forEach(el => el.style.display = 'none');
        } else {
            profileLinks.forEach(el => el.style.display = '');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('auth.js loaded - Token exists:', isLoggedIn());

    updateNavigation();
    updateRoleLinks();

    // Only redirect if we're on profile page without token
    if (window.location.pathname === '/profile' && !isLoggedIn()) {
        window.location.href = '/login';
        return;
    }

    if (isLoggedIn()) {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            const [url, options = {}] = args;
            if (typeof url === 'string' && url.startsWith('/api/')) {
                return originalFetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
            }
            return originalFetch(url, options);
        };
    }
});

// Simplified click handler - only prevent if not logged in
document.addEventListener('click', function (e) {
    const accountLink = e.target.closest('#accountLink');
    if (accountLink && !isLoggedIn()) {
        e.preventDefault();
        window.location.href = '/login';
    }
    // If logged in, let the normal link navigation happen
});

function checkPageAccess() {
    const token = getToken();
    const path = window.location.pathname;

    if (path === '/dashboard') {
        const role = getUserRole();
        if (role !== 'ROLE_ADMIN') {
            alert('Access denied: Admin only');
            window.location.href = '/';
            return;
        }
    }
}


document.addEventListener('DOMContentLoaded', checkPageAccess);