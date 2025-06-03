import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBlYwH5xgfXm71YP0cvVu-kqZ2r-Mfs2O0",
    authDomain: "tt-2-2996d.firebaseapp.com",
    projectId: "tt-2-2996d",
    storageBucket: "tt-2-2996d.firebasestorage.app",
    messagingSenderId: "148332767233",
    appId: "1:148332767233:web:0dfd3703e27da2ff88f800"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();