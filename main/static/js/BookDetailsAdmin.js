const EditBookBtn = document.getElementById("EditBookButton");
const DeleteBookBtn = document.getElementById("DeleteBookButton");
const currBookId = new URLSearchParams(window.location.search).get("id");

const messageContainer = document.createElement('div');
messageContainer.className = 'message';
DeleteBookBtn.parentElement.appendChild(messageContainer);

function showMessage(message, isSuccess) {
    messageContainer.textContent = message;
    messageContainer.className = `message ${isSuccess ? 'success' : 'error'} show`;
}

// EDIT BOOK BUTTON
EditBookBtn.addEventListener('click', () => {
    const editUrl = `/edit-book/?id=${currBookId}`;
    window.location.href = editUrl;
});

DeleteBookBtn.onclick = async () => {
    const isConfirmed = confirm("Are you sure you want to delete this book?");
    
    if (isConfirmed) {
        try {
            await DeleteBook(currBookId);
            const bookTitle = document.getElementById('BookTitle').textContent;
            
            const notificationWrapper = document.createElement('div');
            notificationWrapper.className = 'notification-wrapper';
            
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = `Successfully deleted "${bookTitle}"`;
            
            notificationWrapper.appendChild(successMsg);
            document.body.appendChild(notificationWrapper);
            
            setTimeout(() => {
                notificationWrapper.remove();
                window.location.href = redirectionAfterDelete;
            }, 2500);
        } catch (error) {
            const notificationWrapper = document.createElement('div');
            notificationWrapper.className = 'notification-wrapper';
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'success-message error';
            errorMsg.textContent = 'Failed to delete book. Please try again.';
            
            notificationWrapper.appendChild(errorMsg);
            document.body.appendChild(notificationWrapper);
            setTimeout(() => notificationWrapper.remove(), 2500);
            console.error('Error deleting book:', error);
        }
    }
};

async function DeleteBook(bookId) {
    const response = await fetch(`/view-book-details-admin/delete-book/${bookId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to delete book');
    }
    
    return data;
}
