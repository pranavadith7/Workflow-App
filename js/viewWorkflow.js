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

// Function to fetch data from Firestore and populate the card dynamically
async function populateCard() {
    const cardsContainer = document.getElementById('viewWorkflowContainer');
    document.getElementById("viewWorkflowContainer").innerHTML = '';

    // Fetch data from Firestore and order by the 'level' field in ascending order
    const querySnapshot = await getDocs(query(collection(db, 'cards'), where('author', '==', sessionStorage.getItem("email")), orderBy('level', 'asc')));

    // Loop through the documents and create card elements dynamically
    querySnapshot.forEach((doc) => {
        const cardData = doc.data();
        const cardId = doc.id;
        const cardDiv = createCardElement(cardId, cardData);
        cardsContainer.appendChild(cardDiv);
    });
}

// Function to create a card element
function createCardElement(cardId, cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'mb-3', 'custom-card');

    // Set border color based on 'approved' field
    cardDiv.style.border = cardData.approved ? '2px solid green' : '2px solid red';

    // Card header
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
    emailElement.textContent = cardData.email; // Display email field from Firestore

    cardHeader.appendChild(badgeSpan);
    cardHeader.appendChild(reviewerLabel);
    cardHeader.appendChild(emailElement);

    // Card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titleElement = document.createElement('h5');
    titleElement.classList.add('card-title');
    titleElement.textContent = cardData.title; // Assuming "title" is a field in your Firestore document

    const messageElement = document.createElement('p');
    messageElement.classList.add('card-text');
    messageElement.textContent = cardData.message; // Assuming "message" is a field in your Firestore document

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

    dropdownMenu.innerHTML = '';

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

export {populateCard, createCardElement};