import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyDYZGC2nGJfVsTt7DOmnt9bKPT4UfGisEA",

    authDomain: "coc-data-aebee.firebaseapp.com",

    projectId: "coc-data-aebee",

    storageBucket: "coc-data-aebee.firebasestorage.app",

    messagingSenderId: "158101419320",

    appId: "1:158101419320:web:0fc522dec5df0e619c7dcd"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);