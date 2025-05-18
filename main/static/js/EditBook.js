const COLORS = {
    "Fail" : "#FC0005",
    "Success" : "#14D97D"
}

window.onload = LoadOldBookData;

const inputElements = document.
getElementsByClassName("EditBookForm_BookIdInput");
const resultMessage = document.getElementById("resultMessage");
const resultMessageText = document.getElementById("resultMessageText");

const saveButton = document.getElementById("EditBookForm_SaveButtonId");
const cancelButton = document.getElementsByClassName("EditBookForm_CancelButton").item(0);

let BookImage;
const ChooseImageInput = document.getElementById("imageUpload");

saveButton.onclick = SaveBookNewData;


cancelButton.onclick =  () => {
    window.location.reload();
}

ChooseImageInput.onchange = () => {
    const file = ChooseImageInput.files[0];

    if (!file) return;

    BookImage = file;
    const imaged_Showen = document.getElementById("EditBookForm_bookImage");
    imaged_Showen.src = URL.createObjectURL(BookImage);
}

async function SaveBookNewData(event) {
    event.preventDefault();
    let result = TryParseBookData(inputElements);
    if (result === undefined) {
        showNotification("Failed to edit book. Please check your inputs.", false);
        return;
    }

    result.image = BookImage;
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    result.id = parseInt(bookId);
    saveButton.disabled = true;
    
    try {
        const response = await MakeUpdateBookCall(result);
        const data = await response.json();
        
        if (response.ok && data.success) {
            const bookTitle = document.querySelector('[name="title"]').value;
            showNotification(`Successfully updated "${bookTitle}"`, true);
        } else {
            showNotification("Failed to edit book. Please try again.", false);
        }
    } catch (error) {
        showNotification("Error occurred while editing book.", false);
        console.error('Error:', error);
    } finally {
        saveButton.disabled = false;
    }
}

function showNotification(message, isSuccess) {
    const notificationWrapper = document.createElement('div');
    notificationWrapper.className = 'notification-wrapper';
    notificationWrapper.style.position = 'fixed';
    notificationWrapper.style.top = '80px';
    notificationWrapper.style.right = '20px';
    notificationWrapper.style.zIndex = '9999';
    
    const notification = document.createElement('div');
    notification.className = `success-message ${!isSuccess ? 'error' : ''}`;
    notification.textContent = message;
    notification.style.backgroundColor = isSuccess ? '#00CF76' : '#ff4444';
    notification.style.color = 'white';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    notificationWrapper.appendChild(notification);
    document.body.appendChild(notificationWrapper);
    
    setTimeout(() => {
        notificationWrapper.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notificationWrapper.remove(), 300);
    }, 2500);
}

async function LoadOldBookData(){
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    await LoadOldBook(bookId);
}


async function MakeUpdateBookCall(Book){
    const formData = new FormData();
    for (let key in Book){
        formData.append(key,Book[key])
    }

    let request = new Request(window.location.href,{
        method : 'POST',
        headers:{
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
    });

    return await fetch(request);
}

async function LoadOldBook(id){
    let url = `/?id=${id}`
    let request = new Request(url,{
        method : 'Get',
        headers:{
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    });

    return  await fetch(request);
}









const validator = {
    ValidateEmpty : (C) => {
        return C.trim() === ""
    }
}

function TryParseBookData(inputs){
    let BookResult = {
        "title" : "",
        "author" : "",
        "description" : "",
        "category" : ""
    };

    for (let i in BookResult){
        for (let j in inputs){
            if (!inputs[j] || typeof inputs[j].id !== 'string') continue;
            let S = inputs[j].id.toLowerCase();
            if (S.includes(i)){
                BookResult[i] = inputs[j].value;
            }
        }
    }
/*
    for (let item in BookResult){
        if (validator.ValidateEmpty(BookResult[item]))
            return undefined;
    }*/

    return BookResult;
}
