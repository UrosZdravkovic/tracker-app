// firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDhvrYPLe5NAH-0fpd8U_KubRcB8l-ppKg",
  authDomain: "routinetracker-db.firebaseapp.com",
  projectId: "routinetracker-db",
  storageBucket: "routinetracker-db.appspot.com",  
  messagingSenderId: "54365819400",
  appId: "1:54365819400:web:a546432a9d974ee011f7bd",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

// Firebase Authentication instance
const auth = getAuth(app);

export { db, auth };

