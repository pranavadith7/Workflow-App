import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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

// Function to populate the dropdown with user IDs
async function populateDropdown(dropdownId) {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const dropdownMenu = document.getElementById(dropdownId);

    snapshot.forEach((doc) => {
        var dropdownItem = document.createElement('li');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.textContent = doc.id; // Use the document ID as the dropdown item
        dropdownItem.addEventListener('click', function () {
            document.getElementById(dropdownId).previousElementSibling.textContent = doc.id;
        });
        dropdownMenu.appendChild(dropdownItem);
    });
}

// Update card button event listener
document.getElementById('updateCardButton').addEventListener('click', async function () {
    try {
        const cardContainer = document.getElementById('workflowContainer');
        const cards = cardContainer.querySelectorAll('.custom-card');

        for (let i = 0; i < cards.length; i++) {
            const cardId = i + 1;
            const cardTitleInput = document.getElementById('cardTitleInput' + cardId);
            const cardMessageInput = document.getElementById('cardMessageInput' + cardId);
            const dropdownMenuButton = document.getElementById('dropdownMenuButton' + cardId);
            const badgeNumber = cardId

            const cardTitle = cardTitleInput.value;
            const cardMessage = cardMessageInput.value;
            const selectedEmail = dropdownMenuButton.textContent;

            await addDoc(collection(db, 'cards'), {
                badge: badgeNumber,
                title: cardTitle,
                message: cardMessage,
                email: selectedEmail,
                approved: false,
            });
        }
        console.log('All cards updated in Firestore');
    } catch (e) {
        console.error('Error updating cards: ', e);
    }
});

// Function to create a new card
function createCard() {
    var cardContainer = document.getElementById('workflowContainer');
    var cardCount = cardContainer.children.length + 1; // Increment card count
    var newCard = document.createElement('div');
    newCard.classList.add('card', 'border-dark', 'mb-3', 'custom-card');
    newCard.id = 'card' + cardCount;

    var cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');
    var cardBadge = document.createElement('span');
    cardBadge.classList.add('badge', 'bg-primary');
    cardBadge.textContent = cardCount;
    cardHeader.appendChild(cardBadge);

    var headerContent = document.createElement('div');
    headerContent.classList.add('d-flex', 'align-items-center'); // Flex container for label and dropdown
    var reviewerLabel = document.createElement('label');
    reviewerLabel.setAttribute('for', 'dropdownMenuButton' + cardCount);
    reviewerLabel.classList.add('form-label', 'me-2');
    reviewerLabel.textContent = 'Reviewer:';
    reviewerLabel.style.fontWeight = 'bold';
    headerContent.appendChild(reviewerLabel);

    var dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('dropdown', 'd-inline-block');
    var dropdownButton = document.createElement('button');
    dropdownButton.classList.add('btn', 'btn-secondary', 'dropdown-toggle');
    dropdownButton.setAttribute('type', 'button');
    dropdownButton.setAttribute('id', 'dropdownMenuButton' + cardCount);
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.textContent = 'Select Email';
    dropdownDiv.appendChild(dropdownButton);

    var dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton' + cardCount);
    dropdownMenu.id = 'emailDropdown' + cardCount;
    dropdownDiv.appendChild(dropdownMenu);

    headerContent.appendChild(dropdownDiv);
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

    // Populate the dropdown menu with user IDs for the new card
    populateDropdown('emailDropdown' + cardCount);
}


// Add card button event listener
document.getElementById('addCardButton').addEventListener('click', function () {
    createCard();
});

// Populate the dropdown menu with user IDs for the initial card
populateDropdown('emailDropdown1');