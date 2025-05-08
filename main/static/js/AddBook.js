import {TryParseData} from "./Utilities/Parser.js";

const COLORS = {
    "Fail" : "#FC0005",
    "Success" : "#14D97D"
}

let ChooseBookImage;

const inputElements = document.getElementsByClassName("Add_inputField");

const addBtn = document.getElementsByClassName("add-btn").item(0);
const cancelBtn = document.getElementsByClassName("cancel-btn").item(0);
const addImageInput = document.getElementById("coverImage");

const resultMessage = document.getElementById("resultMessage");
const resultMessageText = document.getElementById("resultMessageText");

const imageSelectedText = document.getElementById("imageSelectionIndicator");


addBtn.onclick = LoadDataFromInputFields;

cancelBtn.onclick = () => {
    for(let i = 0 ; i < inputElements.length ; i++){
        if (!inputElements[i] || typeof inputElements[i].value !== "string")
            continue;
        inputElements[i].value = "";
    }

    ChooseBookImage = undefined;
    imageSelectedText.style.color = COLORS["Fail"];
    imageSelectedText.textContent = "Image Not Selected";
}

addImageInput.onchange = () => {
    const file = addImageInput.files[0];
    
    if(!file){
        imageSelectedText.style.color = COLORS["Fail"];
        imageSelectedText.textContent = "Image Not Selected";
        return;   
    }
    
    ChooseBookImage = file;
    
    imageSelectedText.style.color = COLORS["Success"];
    imageSelectedText.textContent = "Image Selected ! :D";
}

function LoadDataFromInputFields(event) {
    event.preventDefault();
    let result = TryParseData(inputElements);
    
    if (!ChooseBookImage) {
        showError("Please select a book cover image");
        return;
    }

    if (result === undefined) {
        showError("Please check your inputs");
        return;
    }


    showSuccess("Book added successfully!");
}

function showError(message) {
    resultMessage.style.backgroundColor = COLORS["Fail"];
    resultMessageText.textContent = message;
    showMessage();
}

function showSuccess(message) {
    resultMessage.style.backgroundColor = COLORS["Success"];
    resultMessageText.textContent = message;
    showMessage();
}

function showMessage() {
    resultMessage.style.top = "100px";
    setTimeout(() => {
        resultMessage.style.top = "-100px";
    }, 5000);
}

async function MakeAddBookCall(bookDetails,bookImage){
    let request = new Request("url",{
        method : "Post",
        "Content-type" : "application/json",
        body: JSON.stringify(bookDetails)
    });
    
    let response = await fetch(request);
    
    
    return await response.json();
}