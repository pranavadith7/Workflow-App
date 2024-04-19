import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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

// Function to render cards for each document in the "cards" collection
async function renderCards() {
    const cardsContainer = document.getElementById('cardsContainer');

    cardsContainer.innerHTML = '';

    // Get all documents from the "cards" collection
    const snapshot = await getDocs(collection(db, 'cards'));
    snapshot.forEach(doc => {
        const card = createCardElement(doc.id, doc.data());
        cardsContainer.appendChild(card);
    });
}

// Function to create a card element with approve and reject buttons
function createCardElement(cardId, cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'border', 'p-3');

    // Display card data fields
    const titleElement = document.createElement('h6');
    titleElement.classList.add('card-title');
    titleElement.textContent = 'Title: ' + cardData.title;
    const idElement = document.createElement('p');
    idElement.classList.add('card-id');
    idElement.textContent = 'ID: ' + cardData.id;
    const messageElement = document.createElement('p');
    messageElement.classList.add('card-text');
    messageElement.textContent = 'Message: ' + cardData.message;
    const emailElement = document.createElement('p');
    emailElement.classList.add('card-text');
    emailElement.textContent = 'Email: ' + cardData.email;
    const approvedElement = document.createElement('p');
    approvedElement.classList.add('card-text', 'fw-bold');
    approvedElement.textContent = 'Approved: ' + cardData.approved;

    // Create approve button
    const approveButton = document.createElement('button');
    approveButton.classList.add('btn', 'btn-success', 'me-2');
    approveButton.textContent = 'Approve';
    approveButton.addEventListener('click', async () => {
        const approve = doc(db, "cards", cardId);
        await updateDoc(approve, {
            approved: true
        });
        renderCards();
    });

    // Create reject button
    const rejectButton = document.createElement('button');
    rejectButton.classList.add('btn', 'btn-danger');
    rejectButton.textContent = 'Reject';
    rejectButton.addEventListener('click', async () => {
        const reject = doc(db, "cards", cardId);
        await updateDoc(reject, {
            approved: false
        });
        renderCards();
    });

    // Create button container and center buttons with space between them
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-flex', 'justify-content-center', 'mt-3');
    buttonContainer.style.gap = '10px'; // Space between buttons
    buttonContainer.appendChild(approveButton);
    buttonContainer.appendChild(rejectButton);

    // Append elements to card div
    cardDiv.appendChild(titleElement);
    cardDiv.appendChild(messageElement);
    cardDiv.appendChild(idElement);
    cardDiv.appendChild(emailElement);
    cardDiv.appendChild(approvedElement);
    cardDiv.appendChild(buttonContainer);

    return cardDiv;
}

// Render cards on page load
renderCards();
