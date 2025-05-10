function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function updateNavigationByRole() {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    const addBookNav = document.querySelector('.AddBookButton')?.parentElement?.parentElement;
    const borrowedBooksNav = document.querySelector('.BorrowedBooksButton')?.parentElement?.parentElement;
    
    if (!addBookNav && !borrowedBooksNav) return;
    
    if (addBookNav) {
        const addBookText = addBookNav.nextElementSibling;
        addBookNav.style.display = 'none';
        if (addBookText) addBookText.style.display = 'none';
        
        if (userId && userRole === 'admin') {
            addBookNav.style.display = 'block';
            if (addBookText) addBookText.style.display = 'block';
        }
    }
    
    if (borrowedBooksNav) {
        const borrowedBooksText = borrowedBooksNav.nextElementSibling;
        borrowedBooksNav.style.display = 'none';
        if (borrowedBooksText) borrowedBooksText.style.display = 'none';
        
        if (userId && userRole !== 'admin') {
            borrowedBooksNav.style.display = 'block';
            if (borrowedBooksText) borrowedBooksText.style.display = 'block';
        }
    }
}

function updateNavbarAuth() {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const navButtons = document.querySelector('.nav-buttons');

    if (!navButtons) return;
    
    if (userId) {
        const username = localStorage.getItem('username') || 'User';
        navButtons.innerHTML = `
            <span class="nav-user">Welcome, ${username}</span>
            <a href="#" class="nav-button" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    localStorage.clear();
                    window.location.href = '/';
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Logout failed:', error);
                alert('Failed to logout. Please try again.');
            }
        });
    } else {
        navButtons.innerHTML = `
            <a href="/register/" class="nav-button">Register</a>
            <a href="/login/" class="nav-button">Login</a>
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
