function searchBooks(query, category) {
    if (!query) return dummyBooks;
    
    query = query.toLowerCase().trim();
    return dummyBooks.filter(book => {
        switch(category) {
            case 'title':
                return book.title.toLowerCase().includes(query);
            case 'author':
                return book.author.toLowerCase().includes(query);
            case 'category':
                return book.category.toLowerCase().includes(query);
            default:
                return book.title.toLowerCase().includes(query) || 
                       book.author.toLowerCase().includes(query) || 
                       book.category.toLowerCase().includes(query);
        }
    });
}

function handleSearch(query, category) {
    const isViewBooksPage = window.location.pathname.includes('ViewBooks.html');
    
    if (isViewBooksPage) {
        const filteredBooks = searchBooks(query, category);
        if (filteredBooks.length === 0) {
            const container = document.querySelector('.CardsContainer');
            container.innerHTML = '<div class="no-results">No books found matching your search criteria</div>';
        } else {
            totalBooks = filteredBooks.length;
            currentPage = 1; 
            displayBooks(filteredBooks);
        }
    } else {
        const searchParams = new URLSearchParams();
        if (query) searchParams.set('query', query);
        if (category) searchParams.set('category', category);
        window.location.href = `pages/ViewBooks.html?${searchParams.toString()}`;
    }
}

const searchInput = document.getElementById('search');
const searchCategory = document.querySelector('.search-category');

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        const category = searchCategory.value;
        handleSearch(query, category);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const category = urlParams.get('category') || 'title';
    
    if (query) {
        searchInput.value = query;
        searchCategory.value = category;
        handleSearch(query, category);
    } else {
        totalBooks = dummyBooks.length;
        displayBooks(dummyBooks); 
    }
});