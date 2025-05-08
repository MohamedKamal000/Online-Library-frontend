const API_URL = ''; 
const currBookId = new URLSearchParams(window.location.search).get("id");
const currentUser = localStorage.getItem("currentUser");
const BorrowBtn = document.getElementById("BorrowButton");

async function checkBookStatus() {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
        BorrowBtn.textContent = 'Login to Borrow';
        BorrowBtn.classList.add('unavailable');
        //EDIT THIS LATER
        // BorrowBtn.onclick = () => window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/books/${currBookId}/status`, {
            //example endpoint for now will edit later in phase 3
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        const data = await response.json();
        
        if (data.isBorrowed) {
            BorrowBtn.textContent = 'Unavailable';
            BorrowBtn.disabled = true;
            BorrowBtn.classList.add('unavailable');
        } else {
            BorrowBtn.textContent = 'Borrow';
            BorrowBtn.disabled = false;
            BorrowBtn.classList.remove('unavailable');
        }
    } catch (error) {
        console.error('Error checking book status:', error);
    }
}

BorrowBtn.onclick = async () => {
    try {
        const response = await MakeBorrowCall();
        if (response.success) {
            alert('Book borrowed successfully!');
            await checkBookStatus();
        } else {
            alert('Failed to borrow book. Please try again.');
        }
    } catch (error) {
        alert('Error borrowing book');
        console.error(error);
    }
};

async function MakeBorrowCall() {
    const request = new Request(`${API_URL}/books/${currBookId}/borrow`, {
        //example enpoint for now will edit later in phase 3
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
            userId: currentUser
        })
    });
    
    const response = await fetch(request);
    return await response.json();
}

document.addEventListener('DOMContentLoaded', checkBookStatus);