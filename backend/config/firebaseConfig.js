import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import admin from 'firebase-admin'; 

const firebaseConfig = {
  apiKey: "AIzaSyC_hCZWrPrMmyLZkqVFMdHHqlnhO3_PTAI",
  authDomain: "authentication-dsiii.firebaseapp.com",
  projectId: "authentication-dsiii",
  storageBucket: "authentication-dsiii.appspot.com",
  messagingSenderId: "594041859861",
  appId: "1:594041859861:web:3d1187619f2442f2cec31c",
  measurementId: "G-NC4PJ32R4Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  admin.app();
}

export { app, auth, admin };
