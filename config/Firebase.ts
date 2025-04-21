// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjd-KBAqGstzFQStTN2eXWPC3baK7OAcI",
  authDomain: "doctor-management-mob-app.firebaseapp.com",
  projectId: "doctor-management-mob-app",
  storageBucket: "doctor-management-mob-app.firebasestorage.app",
  messagingSenderId: "691501069737",
  appId: "1:691501069737:web:adf90a5c82478abf5e80b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);