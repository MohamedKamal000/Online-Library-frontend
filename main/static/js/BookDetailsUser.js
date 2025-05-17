const currBookId = new URLSearchParams(window.location.search).get("id");
const currentUser = localStorage.getItem("currentUser");
const BorrowBtn = document.getElementById("BorrowButton");

async function checkBookStatus() {
    try {
        const response = await fetch(`/CheckBookBorrowStatus/${currBookId}`, {
            method : 'GET',
            headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        });
        const data = await response.json();
        if (data.success && data.isBorrowed) {
            BorrowBtn.textContent = 'Borrow';
            BorrowBtn.disabled = false;
            BorrowBtn.classList.remove('unavailable');
        } else {
            BorrowBtn.textContent = 'Unavailable';
            BorrowBtn.disabled = true;
            BorrowBtn.classList.add('unavailable');
        }
    } catch (error) {
        console.error('Error checking book status:', error);
    }
}

BorrowBtn.onclick = async () => {
    try {
        const response = await MakeBorrowCall();
        console.log('Borrow response:', response);

        if (response.success) {
            alert('Book borrowed successfully!');
        } else {
            alert('Failed to borrow book: ' + (response.error || JSON.stringify(response)));
        }
    } catch (error) {
        alert('Error borrowing book');
        console.error('Borrow error:', error);
    }
};

async function MakeBorrowCall() {
    const request = new Request(`/borrow-book/${currBookId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json'
        }
    });

    try {
        const response = await fetch(request);

        try {
            return await response.json();
        } catch (jsonErr) {
            const text = await response.text();
            console.error('Failed to parse JSON:', text);
            return { success: false, error: 'Invalid JSON response from server' };
        }
    } catch (fetchErr) {
        console.error('Fetch error:', fetchErr);
        throw fetchErr;
    }
}




document.addEventListener('DOMContentLoaded', checkBookStatus);
//window.onload = LoadUserBorrowedBooks;