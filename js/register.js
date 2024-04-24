import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, setDoc, query, where, getDocs, doc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Initialize Firebase app
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
    const registerForm = document.querySelector('.register_form form');

    // Check if the form element exists
    if (registerForm) {
        // Add an event listener for form submission
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            // Get form data
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmInput = document.getElementById('confirm');

            const email = emailInput.value;
            const password = passwordInput.value;
            const confirm = confirmInput.value;

            // Check if passwords match
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }

            // Check if email already exists in register collection
            const registerQuery = query(collection(db, 'register'), where('email', '==', email));
            const snapshot = await getDocs(registerQuery);
            if (!snapshot.empty) {
                alert('Email already exists');
                return;
            }

            // Add data to Firestore with email as document ID
            try {
                await setDoc(doc(collection(db, 'register'),email), {
                    email: email,
                    password: password,
                    timestamp: new Date().toLocaleString()
                });
                alert('Registration successful');
                // You can redirect the user to another page here if needed
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error adding document: ', error);
                alert('Registration failed');
            }
            
            // Clear form fields
            emailInput.value = '';
            passwordInput.value = '';
            confirmInput.value = '';
        });
    } else {
        console.error('Register form element not found');
    }
});

export function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

export function toggleConfirmPasswordVisibility() {
    const passwordInput = document.getElementById('confirm');
    const icon = document.querySelector('.toggle-confirm-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}