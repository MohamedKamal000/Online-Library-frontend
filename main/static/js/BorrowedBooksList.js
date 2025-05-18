window.onload = LoadUserBorrowedBooks;

const CardsList = document.getElementsByClassName("BB_Card_List").item(0);

const MAX_CARDS_TO_DISPLAY = 4;
let NumberOfPossiblePages;
let ArrayOfCards;
let currentPageIndex = 0;

function LoadCardsWithPage(pageIndex, books) {
    if (!books) {
        books = BORROWED_BOOKS_DATA;
    }
    if (pageIndex >= Math.ceil(books.length / MAX_CARDS_TO_DISPLAY))
        return;

    const allCards = CardsList.querySelectorAll(".BB_Card");
    allCards.forEach((E) => {
        E.remove();
    })

    let start = pageIndex * MAX_CARDS_TO_DISPLAY;
    let end = Math.min(start + MAX_CARDS_TO_DISPLAY, books.length);

    for (let i = start; i < end; i++) {
        CardsList.prepend(CreateCard(books[i]));
    }

    currentPageIndex = pageIndex;
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const paginationContainer = document.querySelector('.pagination-numbers');
    let paginationHTML = '';
    let totalPages = Math.ceil(BORROWED_BOOKS_DATA.length / MAX_CARDS_TO_DISPLAY);
    for (let i = 0; i < totalPages; i++) {
        paginationHTML += `
            <div class="page-number ${i === currentPageIndex ? 'active' : ''}" 
                 onclick="LoadCardsWithPage(${i})">${i + 1}</div>
        `;
    }
    paginationContainer.innerHTML = paginationHTML;
}

async function LoadUserBorrowedBooks() {
    try {
        let data = BORROWED_BOOKS_DATA;

        NumberOfPossiblePages = Math.ceil(data.length / MAX_CARDS_TO_DISPLAY);
        ArrayOfCards = new Array(NumberOfPossiblePages);

        for (let i = 0; i < NumberOfPossiblePages - 1; i++) {
            ArrayOfCards[i] = new Array(MAX_CARDS_TO_DISPLAY).fill(0);
        }

        let remaining = data.length % MAX_CARDS_TO_DISPLAY;
        if (remaining === 0) remaining = MAX_CARDS_TO_DISPLAY;
        ArrayOfCards[NumberOfPossiblePages - 1] = new Array(remaining);

        let pagesCounter = 0;
        let cardCounter = 0;
        data.forEach((d) => {
            ArrayOfCards[pagesCounter][cardCounter] = CreateCard(d);
            cardCounter++;
            if (cardCounter >= MAX_CARDS_TO_DISPLAY) {
                cardCounter = 0;
                pagesCounter++;
            }
        });

        LoadCardsWithPage(0);
    }
    catch (error) {
        console.log(`Error Occured ${error}`)
        console.log(`Error Stack ${error.stack}`)
    }
}

function CreateCard(bookDetails) {
    let card = document.createElement("div");
    card.className = "BB_Card";
    card.onclick = () => {
        const queryString = `?id=${encodeURIComponent(bookDetails.id)}`;
        window.location.href = localStorage.getItem("userRole") === "admin" ? `/view-book-details-admin/${queryString}` : `/view-book-details-user/${queryString}`;
    }

    let cardDetails = document.createElement("div");
    cardDetails.className = "BB_CardDetails";

    let title = document.createElement("div");
    title.className = "BB_BookTitle";
    title.id = "Title";
    title.textContent = bookDetails["name"];

    let author = document.createElement("div");
    author.id = "Author";
    author.textContent = bookDetails["author"];

    let category = document.createElement("div");
    category.id = "Category";
    category.textContent = bookDetails["category"];

    let bookId = document.createElement("div");
    bookId.id = "BookId";
    bookId.textContent = bookDetails["id"];

    cardDetails.appendChild(title);
    cardDetails.appendChild(author);
    cardDetails.appendChild(category);
    cardDetails.appendChild(bookId);

    let unborrowBtn = document.createElement("button");
    unborrowBtn.className = "unborrow-btn";
    unborrowBtn.innerHTML = `<i class="fas fa-undo-alt"></i> Return Book`;
    unborrowBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to return this book?\nThis action cannot be undone.")) {
            try {
                await unborrowBook(bookDetails.id);

                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = `Successfully returned "${bookDetails.name}"`;
                document.body.appendChild(successMsg);

                card.style.opacity = '0';
                card.style.transform = 'translateX(-100%)';
                card.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    card.remove();
                    setTimeout(() => successMsg.remove(), 2500);
                }, 300);

                setTimeout(() => window.location.reload(), 2800);
            } catch (error) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'success-message';
                errorMsg.style.backgroundColor = '#ff4444';
                errorMsg.textContent = 'Failed to return book. Please try again.';
                document.body.appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 2500);
            }
        }
    };

    cardDetails.appendChild(unborrowBtn);

    let bookImage = document.createElement("img");
    bookImage.className = "BB_Card_BookImage";
    bookImage.src = bookDetails["image"];

    card.appendChild(cardDetails);
    card.appendChild(bookImage);


    return card;
}

async function unborrowBook(bookId) {
    const response = await fetch(`/return-book/${bookId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to unborrow book');
    }

    return await response.json();
}