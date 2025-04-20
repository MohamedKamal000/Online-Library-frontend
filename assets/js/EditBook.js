import {TryParseData} from "./Utilities/Parser.js"

const COLORS = {
    "Fail" : "#FC0005",
    "Success" : "#14D97D"
}

const inputElements = document.
getElementsByClassName("EditBookForm_BookIdInput");

const resultMessage = document.getElementById("resultMessage");
const resultMessageText = document.getElementById("resultMessageText");

const saveButton = document.getElementById("EditBookForm_SaveButtonId");
saveButton.onclick = SaveBookNewData;

 async function SaveBookNewData(event) {
    event.preventDefault();
    let result = TryParseData(inputElements);
    if (result === undefined) {
        console.log("Can't Pares Data check inputs");
        resultMessage.style.backgroundColor = COLORS["Fail"];
        resultMessageText.textContent = "Fail :(";
    }
    else{
        resultMessage.style.backgroundColor = COLORS["Success"];
        resultMessageText.textContent = "Success !";
    }

     resultMessage.style.top = "100px";
    
    setTimeout(() => {
        resultMessage.style.top = "-100px";
    },5000);

    // will un comment the following code when we make the backend 
    /*
    saveButton.disabled = true; // to prevent spamming api calls
    const response = await MakeUpdateBookCall(result);
    saveButton.disabled = false;
    
    if (response === undefined)
        console.log("couldn't fetch") // will make a animation or a window that appear tells the user now
    else
        console.log(response)
*/
}

async function MakeUpdateBookCall(Book){
    try{
        let request = new Request('url',{
            method : 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Book)
        });
        
        const response = await fetch(request);
        
        if (!response.ok) throw new Error("Can't make update request ");

        return await response.json();
    }
    catch(e){
        console.log(`Error ${e}`)
    }
    
    return undefined;
}