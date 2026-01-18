// js/account_validation.js
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    const password = document.getElementById('txtPassword').value;
    const confirm = document.getElementById('txtConfirm').value;
    const email = document.getElementById('txtEmail').value;
    const phone = document.getElementById('txtPhoneNum').value;

    if (password !== confirm) {
        alert('Passwords do not match!');
        e.preventDefault();
        return;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email');
        e.preventDefault();
        return;
    }

    // If all good → let form submit normally
    // Do NOT call e.preventDefault() here
});