// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJsJp4r5IMr3j2KJ6jmmbIr15-e6ri6Q4",
  authDomain: "expense-tracker-81ce4.firebaseapp.com",
  projectId: "expense-tracker-81ce4",
  storageBucket: "expense-tracker-81ce4.appspot.com",
  messagingSenderId: "274813259785",
  appId: "1:274813259785:web:bd452ad3cdfe66eccb68d8",
  measurementId: "G-EXZ5NJT3NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)