// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyFfwIJE7NaOj1wq7WGcIa-UDCSj_d5Q0",
  authDomain: "api-alvlp.firebaseapp.com",
  projectId: "api-alvlp",
  storageBucket: "api-alvlp.firebasestorage.app",
  messagingSenderId: "757551479952",
  appId: "1:757551479952:web:b1f791de32f061263dac15",
  measurementId: "G-0WPGBJGQ3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);