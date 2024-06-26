import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyD37DpmC3nPdmkAGbbQiM3PqsoWfk9Djyg",
    authDomain: "workflow-app-69bf8.firebaseapp.com",
    projectId: "workflow-app-69bf8",
    storageBucket: "workflow-app-69bf8.appspot.com",
    messagingSenderId: "684860745629",
    appId: "1:684860745629:web:76f9d7bad34c1998b37174"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function populateCard() {
    const cardsContainer = document.getElementById('viewWorkflowContainer');
    document.getElementById("viewWorkflowContainer").innerHTML = '';

    const topic = document.getElementById("topicDropdownMenuButton").textContent.trim();

    const querySnapshot = await getDocs(query(collection(db, 'cards'), where('author', '==', sessionStorage.getItem("email")), where('topic', '==', topic), orderBy('level', 'asc')));

    querySnapshot.forEach((doc) => {
        const cardData = doc.data();
        const cardId = doc.id;
        const cardDiv = createCardElement(cardId, cardData);
        cardsContainer.appendChild(cardDiv);
    });
}

function createCardElement(cardId, cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'mb-3', 'custom-card');

    cardDiv.style.border = cardData.approved ? '2px solid green' : '2px solid red';

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');

    const badgeSpan = document.createElement('span');
    badgeSpan.classList.add('badge', 'bg-primary');
    badgeSpan.style.fontSize = 'larger';
    badgeSpan.textContent = cardData.level; // Display cardId as badge content

    const reviewerLabel = document.createElement('label');
    reviewerLabel.classList.add('form-label', 'me-2');
    reviewerLabel.textContent = 'Reviewer:';

    const emailElement = document.createElement('p');
    emailElement.classList.add('card-text');
    emailElement.style.overflow = 'auto';
    emailElement.style.whiteSpace = 'nowrap';
    emailElement.textContent = cardData.email; // Display email field from Firestore

    cardHeader.appendChild(badgeSpan);
    cardHeader.appendChild(reviewerLabel);
    cardHeader.appendChild(emailElement);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titleElement = document.createElement('h5');
    titleElement.classList.add('card-title');
    titleElement.textContent = cardData.title;

    const messageElement = document.createElement('p');
    messageElement.classList.add('card-text');
    messageElement.textContent = cardData.message;

    cardBody.appendChild(titleElement);
    cardBody.appendChild(messageElement);

    cardDiv.appendChild(cardHeader);
    cardDiv.appendChild(cardBody);

    return cardDiv;
}

async function populateTopicDropdown() {
    const topicsRef = await getDocs(query(collection(db, 'cards'), where("author", "==", sessionStorage.getItem("email"))));
    const dropdownMenu = document.getElementById('topicDropdown');

    const uniqueTopics = new Set();

    topicsRef.forEach((doc) => {
        const topic = doc.data().topic;
        uniqueTopics.add(topic);
    });

    if (uniqueTopics.size === 0) {
        dropdownMenu.innerHTML = 'No flows found';
    }
    else {
        dropdownMenu.innerHTML = '';
    }

    uniqueTopics.forEach((topic) => {
        const dropdownItem = document.createElement('li');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.textContent = topic;
        dropdownItem.addEventListener('click', function () {
            document.getElementById('topicDropdownMenuButton').textContent = topic;
            populateCard();
        });
        dropdownMenu.appendChild(dropdownItem);
    });
}

populateTopicDropdown();

export { populateCard, createCardElement, populateTopicDropdown };