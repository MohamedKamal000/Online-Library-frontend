const form = document.querySelector("#loginForm");

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('id_email').value.trim();
    const password = document.getElementById('id_password').value;

    if (!email || !password) {
        return showError('Please fill in all fields');
    }

    if (!validateEmail(email)) {
        return showError('Please enter a valid email address');
    }

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        console.log('Response received:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok && data.success) {
            console.log('Login successful:', data);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            window.location.href = '/view-books/';
        } else {
            showError(data.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
    }
});