const form = document.querySelector("#loginForm");
const API_URL = ''; 

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

async function loginUser(email, password) {
    try {
        // for when the API is ready (Phase 3)
        // const response = await fetch(`${API_URL}/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, password })
        // });
        // ---- for testing only, will delete later
        if(email === "test@admin.com" && password === "test1234"){
            return { token: "dummyToken", role: "admin" };
        }
        if(email === "test@user.com" && password === "test1234"){
            return { token: "dummyToken", role: "user" };
        }
        // ------------------------------------------
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return showError('Please fill in all fields');
    }

    if (!validateEmail(email)) {
        return showError('Please enter a valid email address');
    }

    if (!validatePassword(password)) {
        return showError('Password must be at least 8 characters long');
    }

    try {
        const response = await loginUser(email, password);

        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('userId', response.userId);

        const redirectPath = 'ViewBooks.html';
        window.location.href = redirectPath;
    } catch (error) {
        showError(error.message);
    }
});