// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0iM-v1gVfqv2HERb_DML1ZkxvN4gM0hc",
  authDomain: "instagram-clone-fc08d.firebaseapp.com",
  projectId: "instagram-clone-fc08d",
  storageBucket: "instagram-clone-fc08d.appspot.com",
  messagingSenderId: "109301124869",
  appId: "1:109301124869:web:cb890ec6d1a55e020f716c",
  measurementId: "G-DXPGBXY589",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
// const analytics = getAnalytics(app);

export { app, db, storage };
