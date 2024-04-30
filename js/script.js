document.addEventListener('DOMContentLoaded', () => {
    const email = sessionStorage.getItem('email');
    const timestamp = sessionStorage.getItem('timestamp');
    var time_difference = (Date.now() - timestamp) / 1000;
    if (!email || time_difference>300) {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('timestamp');
        window.location.href = 'index.html';
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
import { populateCard, createCardElement, populateTopicDropdown } from "./viewWorkflow.js";
import { renderCards } from "./review.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const reviewerInput = document.getElementById('reviewerInput1');
    const emailSuggestions = document.getElementById('emailSuggestions');

    reviewerInput.addEventListener('input', async (e) => {
        const searchQuery = e.target.value.trim().toLowerCase();
        if (searchQuery.length === 0) {
            emailSuggestions.innerHTML = '';
            return;
        }

        try {
            const suggestedEmails = await fetchEmailSuggestions(searchQuery);
            displayEmailSuggestions(suggestedEmails);
        } catch (error) {
            console.error('Error fetching email suggestions:', error);
        }
    });
});

async function fetchEmailSuggestions(query) {
    const snapshot = await getDocs(collection(db, 'register'));

    const suggestedEmails = [];
    snapshot.forEach(doc => {
        const email = doc.id.toLowerCase();
        if (email.includes(query)) {
            suggestedEmails.push(email);
        }
    });
    return suggestedEmails;
}

function displayEmailSuggestions(suggestions) {
    const emailSuggestions = document.getElementById('emailSuggestions');
    emailSuggestions.innerHTML = '';
    if (suggestions.length === 0) {
        emailSuggestions.innerHTML = '<p>No matching emails found</p>';
        return;
    }

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu', 'show');

    suggestions.forEach(email => {
        const dropdownItem = document.createElement('button');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.type = 'button';
        dropdownItem.textContent = email;
        dropdownItem.addEventListener('click', () => {
            document.getElementById('reviewerInput1').value = email;
            emailSuggestions.innerHTML = '';
        });
        dropdownMenu.appendChild(dropdownItem);
    });

    emailSuggestions.appendChild(dropdownMenu);
}

document.getElementById('updateCardButton').addEventListener('click', async function () {
    try {
        const cardContainer = document.getElementById('workflowContainer');
        const cards = cardContainer.querySelectorAll('.custom-card');

        for (let i = 0; i < cards.length; i++) {
            const topic = document.getElementById("topic").value;
            const cardId = i + 1;
            const cardTitleInput = document.getElementById('cardTitleInput' + cardId);
            const cardMessageInput = document.getElementById('cardMessageInput' + cardId);
            const dropdownMenuButton = document.getElementById('reviewerInput' + cardId);
            const badgeNumber = cardId;

            const cardTitle = cardTitleInput.value;
            const cardMessage = cardMessageInput.value;
            const selectedEmail = dropdownMenuButton.value;

            if (badgeNumber == 1) {
                await addDoc(collection(db, 'cards'), {
                    topic: topic,
                    level: badgeNumber,
                    title: cardTitle,
                    message: cardMessage,
                    email: selectedEmail,
                    approved: false,
                    author: sessionStorage.getItem("email"),
                    previous_level: true
                });
            } else {
                await addDoc(collection(db, 'cards'), {
                    topic: topic,
                    level: badgeNumber,
                    title: cardTitle,
                    message: cardMessage,
                    email: selectedEmail,
                    approved: false,
                    author: sessionStorage.getItem("email"),
                    previous_level: false
                });
            }
        }
        populateCard();
        populateTopicDropdown();
        renderCards();
        clearAllCards();
        alert("Data sent for approval");
        console.log('All cards updated in Firestore');
    } catch (e) {
        console.error('Error updating cards: ', e);
    }
});

function clearAllCards() {
    const cardContainer = document.getElementById('workflowContainer');
    const cards = cardContainer.querySelectorAll('.custom-card');

    for (let i = 0; i < cards.length; i++) {
        const cardId = i + 1;
        if (cardId !== 1) {
            const cardToRemove = document.getElementById('card' + cardId);
            cardContainer.removeChild(cardToRemove);
        }
    }

    // Clear input fields for card 1 and topic
    document.getElementById('topic').value = '';
    document.getElementById('reviewerInput1').value = '';
    document.getElementById('cardTitleInput1').value = '';
    document.getElementById('cardMessageInput1').value = '';
}

function createCard() {
    var cardContainer = document.getElementById('workflowContainer');
    var cardCount = cardContainer.children.length;
    var newCard = document.createElement('div');
    newCard.classList.add('card', 'border-dark', 'mb-3', 'custom-card');
    newCard.id = 'card' + cardCount;

    var cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');
    var cardBadge = document.createElement('span');
    cardBadge.classList.add('badge', 'bg-primary');
    cardBadge.textContent = cardCount;
    cardBadge.style.fontSize = 'larger';
    cardHeader.appendChild(cardBadge);

    var headerContent = document.createElement('div');
    headerContent.classList.add('d-flex', 'align-items-center');
    var reviewerLabel = document.createElement('label');
    reviewerLabel.setAttribute('for', 'reviewerInput' + cardCount);
    reviewerLabel.classList.add('form-label', 'me-2');
    reviewerLabel.textContent = 'Reviewer:';
    reviewerLabel.style.fontWeight = 'bold';
    headerContent.appendChild(reviewerLabel);

    var reviewerInput = document.createElement('input');
    reviewerInput.type = 'text';
    reviewerInput.id = 'reviewerInput' + cardCount;
    reviewerInput.classList.add('form-control');
    reviewerInput.setAttribute('placeholder', 'Type to search email');
    reviewerInput.setAttribute('autocomplete', 'off');
    reviewerInput.setAttribute('data-cardid', cardCount);
    headerContent.appendChild(reviewerInput);

    var dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu', 'show', 'position-absolute', 'w-100');
    dropdownMenu.id = 'emailDropdown' + cardCount;
    dropdownMenu.style.display = 'none';

    headerContent.appendChild(dropdownMenu);
    cardHeader.appendChild(headerContent);

    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    var cardTitleInput = document.createElement('input');
    cardTitleInput.setAttribute('type', 'text');
    cardTitleInput.classList.add('form-control', 'mb-3');
    cardTitleInput.setAttribute('placeholder', 'Enter title');
    cardTitleInput.id = 'cardTitleInput' + cardCount;

    var cardMessageInput = document.createElement('textarea');
    cardMessageInput.classList.add('form-control');
    cardMessageInput.setAttribute('placeholder', 'Enter message');
    cardMessageInput.setAttribute('rows', '3');
    cardMessageInput.id = 'cardMessageInput' + cardCount;

    cardBody.appendChild(cardTitleInput);
    cardBody.appendChild(cardMessageInput);

    newCard.appendChild(cardHeader);
    newCard.appendChild(cardBody);
    cardContainer.appendChild(newCard);

    reviewerInput.addEventListener('input', async (e) => {
        const cardId = e.target.getAttribute('data-cardid');
        const searchQuery = e.target.value.trim().toLowerCase();
        if (searchQuery.length === 0) {
            document.getElementById('emailDropdown' + cardId).style.display = 'none';
            return;
        }

        try {
            const suggestedEmails = await fetchEmailSuggestions(searchQuery);
            displayNewCardEmailSuggestions(cardId, suggestedEmails);
        } catch (error) {
            console.error('Error fetching email suggestions:', error);
        }
    });
}

function displayNewCardEmailSuggestions(cardId, suggestions) {
    const dropdownMenu = document.getElementById('emailDropdown' + cardId);
    dropdownMenu.innerHTML = '';
    if (suggestions.length === 0) {
        dropdownMenu.style.display = 'none';
        return;
    }

    suggestions.forEach(email => {
        const dropdownItem = document.createElement('button');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.type = 'button';
        dropdownItem.textContent = email;
        dropdownItem.addEventListener('click', () => {
            document.getElementById('reviewerInput' + cardId).value = email;
            dropdownMenu.style.display = 'none';
        });
        dropdownMenu.appendChild(dropdownItem);
    });

    dropdownMenu.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('submit');

    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("timestamp");

        window.location.href = 'index.html';
    });
});

// Add card button event listener
document.getElementById('addCardButton').addEventListener('click', function () {
    createCard();
});