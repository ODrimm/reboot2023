let data = [];
let currentQuestion = 0;
let canSubmit = true;

const chat = document.getElementById('Chat');
const textSubmit = document.getElementById('TextSubmit');

loadJSONData(); // Load data from JSON file

function clickEvent() { // When the user clicks on the submit button
    if (canSubmit) {
        canSubmit = false;
        let extracted = textSubmit.value.toLowerCase();
        let answear = searchAnswear(extracted);
        userSpeak(textSubmit.value);
        if (answear != null) {
            chatSpeak(data[currentQuestion].text);
        } else {
            chatSpeak("Je n'ai pas compris, pouvez-vous reformuler ?");
        }
    }
}

function chatSpeak(text) {
    let textPos = 0;
    const interval = setInterval(chatDisplay, getRandomInt(50, 150));

    chat.innerHTML = chat.innerHTML + '<section id="question' + currentQuestion + '" class="chatGPT"></section>';

    function chatDisplay() { //les lettres apparaissent une par une

        let random = getRandomInt(textPos, textPos + 8);
        let textToAdd = text.slice(textPos, random);
        const chats = document.getElementsByClassName("chatGPT");
        const currentChat = chats[chats.length - 1];
        currentChat.innerHTML = currentChat.innerHTML + textToAdd;
        textPos = random;
        if (textPos > text.length) {
            clearInterval(interval);
        }
    }

    setTimeout(() => {
        canSubmit = true;
    }, 1000);
}

function userSpeak(text) {
    //les lettres apparaissent une par une
    chat.innerHTML = chat.innerHTML + '<section class="chatUser">' + text + "</section>";
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
