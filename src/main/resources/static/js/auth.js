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
    const role = getUserRole();

    const dashboardLinks = document.querySelectorAll('a[href="/dashboard"]');
    if (dashboardLinks.length) {
        if (role !== 'ROLE_ADMIN') {
            dashboardLinks.forEach(el => el.style.display = 'none');
        }
    }

    const profileLinks = document.querySelectorAll('a[href="/profile"]');
    if (profileLinks.length && !role) {
        profileLinks.forEach(el => el.style.display = 'none');
    }
}

document.addEventListener('DOMContentLoaded', updateRoleLinks);


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

function checkPageAccess() {
    const role = getUserRole();
    const path = window.location.pathname;

    if (path === '/dashboard' && role !== 'ROLE_ADMIN') {
        alert('Access denied: Admin only');
        window.location.href = '/';
    }

    if (path === '/profile' && !role) {
        alert('Access denied: Login required');
        window.location.href = '/login';
    }
}
document.addEventListener('DOMContentLoaded', checkPageAccess);
