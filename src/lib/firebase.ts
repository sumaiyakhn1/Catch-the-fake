// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Paste your config from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyB-gHHe5mhDgvbnqsSL1bYWzEMyO-TtOws",
    authDomain: "fake-or-safe.firebaseapp.com",
    projectId: "fake-or-safe",
    storageBucket: "fake-or-safe.firebasestorage.app",
    messagingSenderId: "851070454054",
    appId: "1:851070454054:web:fb4cc6119906bcc99199e7",
   
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);