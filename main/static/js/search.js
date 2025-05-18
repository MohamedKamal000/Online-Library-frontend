function searchBooks(query, category, books) {
    if (!query) return books;

    query = query.toLowerCase().trim();
    return books.filter(book => {
        switch (category) {
            case 'title':
                return book.title && book.title.toLowerCase().includes(query);
            case 'author':
                return book.author && book.author.toLowerCase().includes(query);
            case 'category':
                return book.category && book.category.toLowerCase().includes(query);
            default:
                return false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchCategory = document.querySelector('.search-category');

    if (!searchInput || !searchCategory) return;

    function updateSearchResults(books, displayFunction, updatePagination) {
        const query = searchInput.value;
        const category = searchCategory.value;
        const filteredBooks = searchBooks(query, category, books);

        if (typeof totalBooks !== 'undefined') {
            totalBooks = filteredBooks.length;
        }
        currentPage = 1;
        displayFunction(filteredBooks);
        updatePagination();
    }

    searchInput.addEventListener('input', () => {
        if (typeof allBooks !== 'undefined') {
            updateSearchResults(allBooks, displayBooks, updatePaginationButtons);
        } else if (typeof BORROWED_BOOKS_DATA !== 'undefined') {
            updateSearchResults(BORROWED_BOOKS_DATA, LoadCardsWithPage, updatePaginationButtons);
        }
    });

    searchCategory.addEventListener('change', () => {
        if (typeof allBooks !== 'undefined') {
            updateSearchResults(allBooks, displayBooks, updatePaginationButtons);
        } else if (typeof BORROWED_BOOKS_DATA !== 'undefined') {
            updateSearchResults(BORROWED_BOOKS_DATA, LoadCardsWithPage, updatePaginationButtons);
        }
    });
});
