// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_hCZWrPrMmyLZkqVFMdHHqlnhO3_PTAI",
  authDomain: "authentication-dsiii.firebaseapp.com",
  projectId: "authentication-dsiii",
  storageBucket: "authentication-dsiii.appspot.com",
  messagingSenderId: "594041859861",
  appId: "1:594041859861:web:3d1187619f2442f2cec31c",
  measurementId: "G-NC4PJ32R4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };