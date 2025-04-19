// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDrGIN46fKgl8aVSnc2FpAWL1Tqt9uP0A",
  authDomain: "expense-tracker-mob-app-30039.firebaseapp.com",
  projectId: "expense-tracker-mob-app-30039",
  storageBucket: "expense-tracker-mob-app-30039.firebasestorage.app",
  messagingSenderId: "555381305350",
  appId: "1:555381305350:web:fe4fde0bfb8fbb795e5387"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);