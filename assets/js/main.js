function updateNavigationByRole() {
    const userRole = localStorage.getItem('userRole') || 'user';
    const addBookNav = document.querySelector('.AddBookButton')?.parentElement?.parentElement;
    const borrowedBooksNav = document.querySelector('.BorrowedBooksButton')?.parentElement?.parentElement;
    
    if (!addBookNav || !borrowedBooksNav) return;
    
    const addBookText = addBookNav.nextElementSibling;
    const borrowedBooksText = borrowedBooksNav.nextElementSibling;

    if (userRole === 'admin') {
        addBookNav.style.display = 'block';
        borrowedBooksNav.style.display = 'none';
        addBookText.style.display = 'block';
        borrowedBooksText.style.display = 'none';
    } else {
        addBookNav.style.display = 'none';
        borrowedBooksNav.style.display = 'block';
        addBookText.style.display = 'none';
        borrowedBooksText.style.display = 'block';
    }
}

function updateNavbarAuth() {
    const userToken = localStorage.getItem('userToken');
    const navButtons = document.querySelector('.nav-buttons');
    
    
    if (userToken) {
        navButtons.innerHTML = `
            <a href="#" class="nav-button" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            const isInPages = window.location.pathname.includes('/pages/');
            window.location.href = isInPages ? '../index.html' : 'index.html';
        });
    } else {
        const isInPages = window.location.pathname.includes('/pages/');
        const pathPrefix = isInPages ? '' : 'pages/';
        navButtons.innerHTML = `
            <a href="${pathPrefix}register.html" class="nav-button">Register</a>
            <a href="${pathPrefix}login.html" class="nav-button">Login</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigationByRole();
    updateNavbarAuth();
});
