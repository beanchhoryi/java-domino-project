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
    updateCheck();
});

document.getElementById('id_image')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => document.getElementById('preview').src = ev.target.result;
        reader.readAsDataURL(file);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.profile-form');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    const saveBtn = form.querySelector('.btn-save');
    const cancelBtn = form.querySelector('.btn-cancel');
    const editProfileBtn = document.querySelector('a[href*="profile_settings"]');
    const imageLabel = document.querySelector('.avatar-label');
    const imageInput = document.getElementById('id_image');
    const logoutWrapper = document.querySelector('.logout-wrapper');

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

    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';

    if (!isEditMode) {
        disableForm();
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enableForm();
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('edit', 'true');
            window.history.pushState({}, '', newUrl);
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            disableForm();

            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('edit');
            window.history.pushState({}, '', newUrl);
        });
    }
});