let data = [];
let currentQuestion = 0;
let lastQuestion;
let canSubmit = true;

const chat = document.getElementById('Chat');
const textSubmit = document.getElementById('TextSubmit');

loadJSONData(); // Load data from JSON file

function clickEvent() { // When the user clicks on the submit button
    if (canSubmit) {
        canSubmit = false;
        let userMessage = textSubmit.value;
        let extracted = userMessage.toLowerCase();
        textSubmit.value = "";
        let answear = searchAnswear(extracted);
        userSpeak(userMessage);
        if (answear != null) {
            chatSpeak(data[currentQuestion].text);
        } else {
            chatSpeak("Je n'ai pas compris, pouvez-vous reformuler ?");
        }
    }
}

function chatSpeak(text) {
    let textPos = 0;
    const interval = setInterval(chatDisplay, getRandomInt(50, 80));

    chat.innerHTML = chat.innerHTML + '<section class="chatItem gpt"><img src="ressources/logo.webp" /><section id="question' + currentQuestion + '" class="chatGPT"></section></section';

    function chatDisplay() { //les lettres apparaissent une par une
        let random = getRandomInt(textPos, textPos + 8);
        let textToAdd = text.slice(textPos, random);
        const chats = document.getElementsByClassName("chatGPT");
        const currentChat = chats[chats.length - 1];
        if (textToAdd.includes("<") || textToAdd.includes(">")) {
            if (textToAdd.includes("<br/>") || textToAdd.includes("<b>") || textToAdd.includes("</b>")){
                currentChat.innerHTML = currentChat.innerHTML + textToAdd;
                currentChat.scrollIntoView({ behavior: "smooth" });
                textPos = random;
            }
        } else {
            currentChat.innerHTML = currentChat.innerHTML + textToAdd;
            currentChat.scrollIntoView({ behavior: "smooth" });
            textPos = random;
        }

        if (textPos > text.length) {
            clearInterval(interval);
            canSubmit = true;
            if(currentQuestion >= lastQuestion){
                textSubmit.classList.add("blocked");
                document.getElementsByClassName("button-response")[0].classList.add("blocked");
                document.getElementsByClassName("chatUi")[0].classList.add("blockedWrapper");
                textSubmit.placeholder = "Désolé, il semblerais que ChatCPT n'ai plus rien à vous dire"
                console.log("blocker")
            }
        }
    }
}

function userSpeak(text) {
    //les lettres apparaissent une par une
    chat.innerHTML = chat.innerHTML + '<section class="chatItem"><img src="ressources/user_1.webp" /><section class="chatUser">' + text + "</section></section>";
    const userChats = document.getElementsByClassName("chatUser");
    userChats[userChats.length - 1].scrollIntoView({ behavior: "smooth" });
}

function searchAnswear(extracted) { // Search for keywords in the extracted text
    let keywordFound = false;

    for (let i = 0; i < data[currentQuestion].answers[0].answersA.length; i++) {
        if (extracted.includes(data[currentQuestion].answers[0].answersA[i].toLowerCase())) {
            keywordFound = true;
            currentQuestion = currentQuestion + data[currentQuestion].nextA;
            if(currentQuestion > 0){
                document.getElementsByClassName("chatInfo")[0].classList.add("hidden")
            }
            return "A";
        }
    }

    if (!keywordFound) {
        for (let i = 0; i < data[currentQuestion].answers[0].answersB.length; i++) {
            if (extracted.includes(data[currentQuestion].answers[0].answersB[i].toLowerCase())) {
                keywordFound = true;
                currentQuestion = currentQuestion + data[currentQuestion].nextB;
                if(currentQuestion > 0){
                    document.getElementsByClassName("chatInfo")[0].classList.add("hidden")
                }
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
    lastQuestion = data.length - 1;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
