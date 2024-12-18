import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_hCZWrPrMmyLZkqVFMdHHqlnhO3_PTAI",
  authDomain: "authentication-dsiii.firebaseapp.com",
  projectId: "authentication-dsiii",
  storageBucket: "authentication-dsiii.appspot.com",
  messagingSenderId: "594041859861",
  appId: "1:594041859861:web:3d1187619f2442f2cec31c",
  measurementId: "G-NC4PJ32R4Y"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
