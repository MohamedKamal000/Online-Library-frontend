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
        console.log("Can't Pares Data check inputs");
        resultMessage.style.backgroundColor = COLORS["Fail"];
        resultMessageText.textContent = "Fail :(";
    }

    resultMessage.style.top = "100px";

    setTimeout(() => {
        resultMessage.style.top = "-100px";
    },5000);

    result.image = BookImage;
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    result.id = parseInt(bookId);
    saveButton.disabled = true; // to prevent spamming api calls
    const response = await MakeUpdateBookCall(result);
    const data = await response.json();
    saveButton.disabled = false;
    console.log(data.success)
    if (!response.ok && data.success){
        resultMessage.style.backgroundColor = COLORS["Fail"];
        resultMessageText.textContent = "Fail :(";
    }
    else{
        resultMessage.style.backgroundColor = COLORS["Success"];
        resultMessageText.textContent = "Success !";
    }
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
