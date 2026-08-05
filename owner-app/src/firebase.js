import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkr0Szqq577Tosyh-hUdrx3Vs0sGWBuXA",
  authDomain: "shelf-sync-63814.firebaseapp.com",
  projectId: "shelf-sync-63814",
  storageBucket: "shelf-sync-63814.firebasestorage.app",
  messagingSenderId: "355197166701",
  appId: "1:355197166701:web:7a3818bd7d5672e1e5cb64",
  measurementId: "G-NTJHK9FCM2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
