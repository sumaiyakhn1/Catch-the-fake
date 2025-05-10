// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Paste your config from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyAc4ywehLP0XPWA3wv5GCfEbEGfkl34Tp4",
    authDomain: "catch-the-fake-15e5e.firebaseapp.com",
    projectId: "catch-the-fake-15e5e",
    storageBucket: "catch-the-fake-15e5e.firebasestorage.app",
    messagingSenderId: "726408513077",
    appId: "1:726408513077:web:fbbb4a0bc9552dd729537c",
    measurementId: "G-MH9NC7BRZC"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);