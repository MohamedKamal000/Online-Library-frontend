
window.onload = LoadBookData;

const bookId = document.getElementById("BookId");
const bookTitle = document.getElementById("BookTitle");
const bookCategory = document.getElementById("BookCategory");
const bookAuthor = document.getElementById("BookAuthor");
const bookDescription = document.getElementById("BookDescription");





async function LoadBookData(){
    const params = new URLSearchParams(window.location.search);
    const bookId_fromParam = params.get("id"); // should make a api call that fetches book old data

     const BookDetails = await GetBookDetails(bookId_fromParam);

     if (BookDetails){
         bookId.textContent = BookDetails.id;
         bookTitle.textContent = BookDetails.title;
         bookAuthor.textContent = BookDetails.author;
         bookDescription.textContent = BookDetails.description;
         bookCategory.textContent = BookDetails.category;
     }else {
         console.error("Book doesn't found");
     }

}



async function GetBookDetails(id){
    let request = new Request('/view-book-details-user/',{
        method : 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({bookId: id})
    });

     try {
        const response = await fetch(request);
        if (!response.ok) {
            throw new Error("Book not found");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching book details:", error);
        return null;
    }
}