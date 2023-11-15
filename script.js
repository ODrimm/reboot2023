let data = [];
let currentQuestion = 0;
const chat = document.getElementById('Chat');
const textSubmit = document.getElementById('TextSubmit');

loadJSONData(); // Load data from JSON file

function clickEvent() { // When the user clicks on the submit button
    let extracted = textSubmit.value.toLowerCase();
    let answear = searchAnswear(extracted);
    chat.innerHTML = chat.innerHTML + '<section class="chatUser">' + extracted + "</section>";
    
    setTimeout(() => {
        chat.innerHTML = chat.innerHTML + '<section class="chatGPT">' + data[currentQuestion].text + "</section>";
    }, 1000);

}

function searchAnswear(extracted) { // Search for keywords in the extracted text
    let keywordFound = false;

    for (let i = 0; i < data[currentQuestion].answers[0].answersA.length; i++) {
        if (extracted.includes(data[currentQuestion].answers[0].answersA[i].toLowerCase())) {
            keywordFound = true;
            currentQuestion = currentQuestion + data[currentQuestion].nextA;
            return "A";
        }
    }

    if (!keywordFound) {
        for (let i = 0; i < data[currentQuestion].answers[0].answersB.length; i++) {
            if (extracted.includes(data[currentQuestion].answers[0].answersB[i].toLowerCase())) {
                keywordFound = true;
                currentQuestion = currentQuestion + data[currentQuestion].nextB;
                return "B";
            }
        }
    }

    if (!keywordFound) {
        return null;
    }
}


async function loadJSONData() { //Load data from JSON file
    const response = await fetch("story.json");
    const jsonData = await response.json();
    data = jsonData;
    chat.innerHTML = '<section class="chatGPT">' + data[currentQuestion].text + "</section>";
}



