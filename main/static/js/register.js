const API_URL = '';
const form = document.getElementById('registerForm');

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Registration failed');
    }
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const isAdmin = document.getElementById('is_admin').checked;
    let hasError = false;

    if (username.length < 4 || username.length > 20) {
        document.getElementById('usernameError').textContent = 'Username must be between 4 and 20 characters.';
        hasError = true;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        hasError = true;
    }

    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long.';
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        const user = { username, email, password, role: isAdmin ? 'admin' : 'user' };
        await registerUser(user);

        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = 'Registration successful! Redirecting to login...';
        successMessage.style.display = 'block';

        setTimeout(() => {
            //edit this later
            // window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});


