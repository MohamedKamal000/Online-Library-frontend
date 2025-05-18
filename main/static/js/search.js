function searchBooks(query, category, books) {
    if (!query) return books;

    query = query.toLowerCase().trim();
    console.log('Searching with:', {
        query,
        category,
        booksArray: books
    });

    return books.filter(book => {
        let match;
        switch (category) {
            case 'title':
                match = ((book.title && book.title.toLowerCase().includes(query)) ||
                        (book.name && book.name.toLowerCase().includes(query)));
                break;
            case 'author':
                match = book.author && book.author.toLowerCase().includes(query);
                break;
            case 'category':
                match = book.category && book.category.toLowerCase().includes(query);
                break;
            default:
                match = false;
        }
        console.log('Book match:', {
            book: book.title || book.name,
            category,
            match
        });
        return match;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchCategory = document.querySelector('.search-category');

    if (!searchInput || !searchCategory) return;

    function updateSearchResults(books, displayFunction, updatePagination) {
        const query = searchInput.value;
        const category = searchCategory.value;
        
        console.log('Search Input:', {
            query,
            category,
            totalBooks: books.length
        });

        const filteredBooks = searchBooks(query, category, books);
        console.log('Filtered Results:', {
            filteredCount: filteredBooks.length,
            results: filteredBooks
        });

        if (typeof BORROWED_BOOKS_DATA !== 'undefined') {
            const cardsList = document.getElementsByClassName("BB_Card_List")[0];
            cardsList.innerHTML = '';  
            
            if (filteredBooks.length === 0) {
                cardsList.innerHTML = '<div class="no-results">No results found</div>';
            } else {
                LoadCardsWithPage(0, filteredBooks);
            }
        } else {
            if (typeof totalBooks !== 'undefined') {
                totalBooks = filteredBooks.length;
            }
            currentPage = 1;
            displayFunction(filteredBooks);
        }
        
        if (typeof updatePagination === 'function') {
            updatePagination();
        }
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
