const form = document.querySelector("#loginForm");
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const userName = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const user = {userName, password};

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const loggedUser = users.find((user) => user.username === userName && user.password === password);
    if (loggedUser) {
        alert('Logged in successfully!');
        window.location.href = 'ViewBooks.html';
    }else{
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = 'block';
    }

})