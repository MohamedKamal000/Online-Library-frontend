async function getBookDetails(bookId) {
    try {
        const response = await fetch(`/view-book-details-user/?id=${bookId}`, {
            method: 'GET'
        });

        if (response.status !== 200) {
            throw new Error("Book doesn't exist");
        }

        return await response.json();
    } catch (error) {
        console.error('Error in retrieving book: ', error);
    }

}


function updatePageContent(book) {
    if (!book) {
        console.error('Book not found');
        return;
    }

    document.querySelector('.text').textContent = book.title;
    document.querySelector('.book-description').textContent = book.description;
    document.querySelectorAll('.body-text').forEach(element => {
        if (element.previousElementSibling?.alt === 'Book ID') {
            element.textContent = book.id;
        } else if (element.previousElementSibling?.alt === 'Author') {
            element.textContent = book.author;
        } else if (element.previousElementSibling?.alt === 'Category') {
            element.textContent = book.category;
        }
    });
    
    document.querySelector('.right-image img').src = book.imageUrl;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    if (bookId) {
        const book = await getBookDetails(bookId);
        updatePageContent(book);
    }

});
