const button = document.getElementById("search-button");
const errors = document.getElementById("errors");
const definitionsElement = document.getElementById("definitions");



errors.style.display = "None";
definitionsElement.style.display = "None";


button.addEventListener("click", searchWord);

let lastWordSearched = "";

//checks if given word is alphabetic
function isAlpha(str) {
    return /^[a-z A-Z()]+$/.test(str);
  }

// gets the word from the user
function searchWord(){

    const input = document.getElementById("input");
    console.log(input.value);
    
    if (input.value != "" && input.value != lastWordSearched && isAlpha(input.value)){
        getDefinition(input.value);
    } else if(!isAlpha(input.value)){
        wordNotFound()
    }
    lastWordSearched = input.value;

}


function wordNotFound(){
    errors.textContent = "Word not found.";
    errors.style = "Block";
    definitionsElement.style.display = "None";
}


// requests definition from API and returns responce object
function getDefinition(word){
    
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.toLowerCase();
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);

    xhr.send();

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status < 400){
            
            definitionsElement.style.display = "Block";
            errors.style.display = "None";
            
            console.log(JSON.parse(xhr.responseText));
            writeDefinition(JSON.parse(xhr.responseText));
        } else if (xhr.readyState == 4 && xhr.status === 404){
            console.log("404");

            wordNotFound()
            
        } else {
            console.log(xhr.status);

            errors.textContent = "ERROR"

            definitionsElement.style.display = "None";
            errors.style.display = "Block";
        }
    }

}

// adds definition to html
function writeDefinition(wordObj){

    // removes older definitions
    document.querySelectorAll(".definition").forEach(DefElem =>{
        DefElem.remove();
    })


    const word = document.getElementById("word-details");
    word.getElementsByTagName("h2")[0].textContent = wordObj[0].word;
    try{
        word.getElementsByTagName("p")[0].textContent = wordObj[0].phonetics[0].text;
        word.getElementsByTagName("p")[0].style.display= "Block";
    } catch{ 
        word.getElementsByTagName("p")[0].style.display= "None";
    }

    for (const definition of wordObj) {

        for (const meaning of definition.meanings){

            let newMeaningElem = document.createElement("div");
            newMeaningElem.className = "definition";
            
            let newMeanPOS = document.createElement("div");
            newMeanPOS.appendChild(document.createTextNode(meaning.partOfSpeech));
            newMeanPOS.className = "partOfSpeech";

            newMeaningElem.appendChild(newMeanPOS);


            console.log(meaning.partOfSpeech);
            let newOrderedLi = document.createElement("ol");

            newMeaningElem.appendChild(newOrderedLi);
            for (const definitions of meaning.definitions) {


                let newLi = document.createElement("li");
                newLi.appendChild(document.createTextNode(definitions.definition))

                newOrderedLi.appendChild(newLi)


            }
            definitionsElement.appendChild(newMeaningElem);




            
        }
    }

}





