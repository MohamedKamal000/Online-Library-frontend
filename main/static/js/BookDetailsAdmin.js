const EditBookBtn = document.getElementById("EditBookButton");
const DeleteBookBtn = document.getElementById("DeleteBookButton");

const bookId_param = new URLSearchParams(window.location.search).get("id");

const messageContainer = document.createElement('div');
messageContainer.className = 'message';
DeleteBookBtn.parentElement.appendChild(messageContainer);

function showMessage(message, isSuccess) {
    messageContainer.textContent = message;
    messageContainer.className = `message ${isSuccess ? 'success' : 'error'} show`;
}

// EDIT BOOK BUTTON
// EditBookBtn.onclick = () => {
//     window.location.href = `EditBook.html?id=${bookId_param}`;
// }

DeleteBookBtn.onclick = async () => {
    const isConfirmed = confirm("Are you sure you want to delete this book?");
    
    if (isConfirmed) {
        try {
            let bookId_int = parseInt(bookId_param)
            await DeleteBook(bookId_int);
            showMessage('Book deleted successfully', true);
            setTimeout(() => {
                window.location.href = redirectionAfterDelete
                }, 2000);
        } catch (error) {
            showMessage('Failed to delete book', false);
            console.error('Error deleting book:', error);
        }
    }
};

async function DeleteBook(bookId) {
    const url = `delete-book/${bookId}/`
    let request = new Request(url, {
        method: "DELETE",
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    });
    
    let response = await fetch(request);
    if (!response.ok) {
        throw new Error('Failed to delete book');
    }
    return await response.json();
}
