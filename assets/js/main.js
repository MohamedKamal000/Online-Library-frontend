function updateNavigationByRole() {
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    
    const addBookNav = document.querySelector('.AddBookButton')?.parentElement?.parentElement;
    const borrowedBooksNav = document.querySelector('.BorrowedBooksButton')?.parentElement?.parentElement;
    
    if (!addBookNav && !borrowedBooksNav) return;
    
    if (addBookNav) {
        const addBookText = addBookNav.nextElementSibling;
        addBookNav.style.display = 'none';
        if (addBookText) addBookText.style.display = 'none';
        
        if (userToken && userRole === 'admin') {
            addBookNav.style.display = 'block';
            if (addBookText) addBookText.style.display = 'block';
        }
    }
    
    if (borrowedBooksNav) {
        const borrowedBooksText = borrowedBooksNav.nextElementSibling;
        borrowedBooksNav.style.display = 'none';
        if (borrowedBooksText) borrowedBooksText.style.display = 'none';
        
        if (userToken && userRole !== 'admin') {
            borrowedBooksNav.style.display = 'block';
            if (borrowedBooksText) borrowedBooksText.style.display = 'block';
        }
    }
}

function updateNavbarAuth() {
    const userToken = localStorage.getItem('userToken');
    const navButtons = document.querySelector('.nav-buttons');

    if (!navButtons) return;
    
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
    try {
        updateNavigationByRole();
        updateNavbarAuth();
    } catch (error) {
        console.error('Error updating navigation:', error);
    }
});
