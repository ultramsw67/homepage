// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4s_heDlG71aAQWe4xqxuTIbXdNO_4U-o",
    authDomain: "sood-page.firebaseapp.com",
    projectId: "sood-page",
    storageBucket: "sood-page.firebasestorage.app",
    messagingSenderId: "891843611404",
    appId: "1:891843611404:web:6d72679c905307933dd729",
    measurementId: "G-EG31LY0NKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
