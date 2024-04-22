import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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

async function renderCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    // Get all documents from the "cards" collection where email matches
    const snapshot = await getDocs(query(collection(db, 'cards'), where('email', '==', sessionStorage.getItem("email"))));

    snapshot.forEach(async (doc) => {
        const cardData = doc.data();
        const previousLevelDoc = await getPreviousLevelDoc(cardData.topic, cardData.level - 1);
        
        // Check if previous level exists and is approved
        if ((previousLevelDoc && previousLevelDoc.data().approved) || cardData.level==1) {
            const card = createCardElement(doc.id, cardData);
            cardsContainer.appendChild(card);
        }
    });
}

async function getPreviousLevelDoc(topic, level) {
    const querySnapshot = await getDocs(query(collection(db, 'cards'), where('topic', '==', topic), where('level', '==', level)));
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0]; // Return the first document found
    }
    return null; // Return null if no document found
}


// Function to create a card element with approve and reject buttons
function createCardElement(cardId, cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'border', 'p-3');

    // Display card data fields
    const titleElement = document.createElement('h6');
    titleElement.classList.add('card-title');
    titleElement.textContent = 'Title: ' + cardData.title;
    const topicElement = document.createElement('p');
    topicElement.classList.add('card-id');
    topicElement.textContent = 'Topic: ' + cardData.topic;
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
    cardDiv.appendChild(topicElement);
    cardDiv.appendChild(emailElement);
    cardDiv.appendChild(approvedElement);
    cardDiv.appendChild(buttonContainer);

    return cardDiv;
}

// Render cards on page load
renderCards();
