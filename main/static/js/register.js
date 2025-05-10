const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.textContent = '');

    const password = document.querySelector('[name="password"]').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    let hasError = false;

    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters';
        hasError = true;
    }

    const username = document.querySelector('[name="username"]').value;
    if (!/^[a-zA-Z0-9]{4,20}$/.test(username)) {
        document.getElementById('usernameError').textContent = 'Username must be 4-20 characters and contain only letters and numbers';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const formData = new URLSearchParams();
    formData.append('username', document.querySelector('[name="username"]').value);
    formData.append('email', document.querySelector('[name="email"]').value);
    formData.append('password', password);
    formData.append('is_admin', document.querySelector('[name="is_admin"]').checked);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('successMessage').textContent = 'Registration successful! Redirecting...';
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            for (const [field, errors] of Object.entries(data.errors)) {
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = errors[0];
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('successMessage').textContent = 'An error occurred. Please try again.';
    }
});


