// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2e_mQxsowArXilGeqFRXT3PhGUth-S0E",
  authDomain: "blog-website-tutorial-pedro.firebaseapp.com",
  projectId: "blog-website-tutorial-pedro",
  storageBucket: "blog-website-tutorial-pedro.appspot.com",
  messagingSenderId: "388774630523",
  appId: "1:388774630523:web:393993f1359d58a297bede"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()

