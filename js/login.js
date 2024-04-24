import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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
    const loginForm = document.querySelector('.login_form form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const registerDoc = doc(db, 'register', email);
        const registerSnapshot = await getDoc(registerDoc);

        if (registerSnapshot.exists()) {
            const registerData = registerSnapshot.data();
            if (password === registerData.password) {
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('timestamp', Date.now());

                try {
                    await addDoc(collection(db, 'login'), {
                        email,
                        password,
                        timestamp: new Date().toLocaleString()
                    });
                    window.location.href = 'home.html';
                } catch (error) {
                    console.error('Error adding document to login collection: ', error);
                }
            } else {
                alert('Wrong password');
                loginForm.reset(); // Reset form fields on wrong password
            }
        } else {
            alert('Wrong email address');
            loginForm.reset(); // Reset form fields on wrong email address
        }
    });
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