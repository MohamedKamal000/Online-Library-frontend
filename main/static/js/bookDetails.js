async function RenderBookDetails(bookId) {
    try {
        await fetch(`/view-book-details-user/?id=${bookId}`, {
            method: 'GET'
        });
    } catch (error) {
        console.error('Error in retrieving book: ', error);
    }

}


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    if (bookId) {
        await RenderBookDetails(bookId);
    }

});
