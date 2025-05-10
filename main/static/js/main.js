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
    const navButtons = document.querySelector('.nav-buttons');

    if (!navButtons) return;
    
    if (userId) {
        navButtons.innerHTML = `
            <a href="#" class="nav-button" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    }
                });
                
                if (response.ok) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Logout failed:', error);
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
