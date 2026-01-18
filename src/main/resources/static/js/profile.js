// Show green check when field is filled
document.querySelectorAll('.profile-form input, .profile-form select').forEach(el => {
    const updateCheck = () => {
        const group = el.closest('.form-group');
        if (el.value.trim()) {
            group.classList.add('valid');
        } else {
            group.classList.remove('valid');
        }
    };
    el.addEventListener('input', updateCheck);
    el.addEventListener('blur', updateCheck);
    updateCheck(); // initial state
});

// Avatar preview
document.getElementById('id_image')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => document.getElementById('preview').src = ev.target.result;
        reader.readAsDataURL(file);
    }
});

// NEW: Form readonly/edit mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.profile-form');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    const saveBtn = form.querySelector('.btn-save');
    const cancelBtn = form.querySelector('.btn-cancel');
    const editProfileBtn = document.querySelector('a[href*="profile_settings"]');
    const imageLabel = document.querySelector('.avatar-label');
    const imageInput = document.getElementById('id_image');
    const logoutWrapper = document.querySelector('.logout-wrapper');

    // Function to disable form (readonly mode)
    function disableForm() {
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', true);
            }
        });
        if (saveBtn) saveBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (imageLabel) imageLabel.style.display = 'none';
        if (imageInput) imageInput.setAttribute('disabled', true);
        if (logoutWrapper) logoutWrapper.style.display = 'none';
    }

    // Function to enable form (edit mode)
    function enableForm() {
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            if (input.tagName === 'SELECT') {
                input.removeAttribute('disabled');
            }
        });
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        if (imageLabel) imageLabel.style.display = 'block';
        if (imageInput) imageInput.removeAttribute('disabled');
        if (logoutWrapper) logoutWrapper.style.display = 'block';
    }

    // Check URL parameter for edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';

    // Set initial state
    if (!isEditMode) {
        disableForm();
    }

    // Enable form when Edit Profile is clicked
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enableForm();

            // Update URL to include edit parameter
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('edit', 'true');
            window.history.pushState({}, '', newUrl);

            // Scroll to form smoothly
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Handle cancel button to go back to readonly mode
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            disableForm();

            // Remove edit parameter from URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('edit');
            window.history.pushState({}, '', newUrl);

            // Optionally reload to reset form values
            // window.location.reload();
        });
    }
});