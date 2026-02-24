// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgejdvglDlq2RH-yKPYh6rznNKg7Ywf-M",
  authDomain: "hacktofit.firebaseapp.com",
  projectId: "hacktofit",
  storageBucket: "hacktofit.firebasestorage.app",
  messagingSenderId: "117845834754",
  appId: "1:117845834754:web:249dc1f76e5dd3504c7b1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);