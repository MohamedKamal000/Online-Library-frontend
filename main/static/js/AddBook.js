
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

async function LoadDataFromInputFields(event) {
    event.preventDefault();
    let result = TryParseBookData(inputElements);

    if (!ChooseBookImage) {
        showError("Please select a book cover image");
        return;
    }

    if (result === undefined) {
        showError("Please check your inputs");
        return;
    }

    result.Image = ChooseBookImage
    let serverResponse = await MakeAddBookCall(result)

    let data = await serverResponse.json()
    if (data.success && serverResponse.ok){
        showSuccess("Book added successfully!");
    }else {
        showError("Something wrong happen");
    }

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

async function MakeAddBookCall(bookDetails){
    const formData = new FormData();
    for (let key in bookDetails) {
        if (key !== "Image") {
            formData.append(key, bookDetails[key]);
        }
    }

    formData.append("image", bookDetails.Image);
    formData.append("csrfmiddlewaretoken", document.querySelector('[name=csrfmiddlewaretoken]').value);

    let request = new Request(window.location.href,{
        method : "POST",
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    });

    return await fetch(request);
}


const validator = {
    ValidateID : (Id) => {
        return Id !== "" && !isNaN(Number(Id));
    },

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

    for (let item in BookResult){
        if (validator.ValidateEmpty(BookResult[item]))
            return undefined;
    }

    return BookResult;
}
