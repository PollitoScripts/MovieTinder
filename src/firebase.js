import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC_2GL-x6yKbZp58r-gqyZhf-BeLHu7h_k",
  authDomain: "movietinder-pollitoscripts.firebaseapp.com",
  databaseURL: "https://movietinder-pollitoscripts-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movietinder-pollitoscripts",
  storageBucket: "movietinder-pollitoscripts.firebasestorage.app",
  messagingSenderId: "1091895135371",
  appId: "1:1091895135371:web:8a043e999d2c6c97dbd88e",
  measurementId: "G-SKLZKB5P3S"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);