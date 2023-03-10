import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCiBjQ3w_Kp25gl0XJSdONawyXjJ_U_KC4",
  authDomain: "fir-crud-c3b85.firebaseapp.com",
  projectId: "fir-crud-c3b85",
  storageBucket: "fir-crud-c3b85.appspot.com",
  messagingSenderId: "90152400347",
  appId: "1:90152400347:web:2237839ffce59f6b45a3fe",
  measurementId: "G-NFTJTBKSFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// console.log(auth)
export { db, auth, storage }