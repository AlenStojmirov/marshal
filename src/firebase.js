// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database"; // For Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDY_7keAOapwki5KHkobg1nZB5fvK8rjjU",
    authDomain: "marshal-vin.firebaseapp.com",
    databaseURL: "https://marshal-vin-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "marshal-vin",
    storageBucket: "marshal-vin.appspot.com",
    messagingSenderId: "880669944160",
    appId: "1:880669944160:web:edd59abb47acf61be59605"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
