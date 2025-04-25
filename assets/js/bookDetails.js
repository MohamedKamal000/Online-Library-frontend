async function getBookDetails(bookId) {
    // In phase 3, replace this with actual API call
    const books = await fetch('../assets/js/bookManager.js')
        .then(response => response.text())
        .then(text => {

            const match = text.match(/const dummyBooks = (\[[\s\S]*?\]);/);
            return match ? eval(match[1]) : [];
            
        });
    return books.find(book => book.id === parseInt(bookId));
    
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
