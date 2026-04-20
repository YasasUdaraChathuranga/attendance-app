import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_k_p0uSNlI8pRfUrYYKtpVRQOIGV3oAw",
  authDomain: "attendance-app-5f2dc.firebaseapp.com",
  projectId: "attendance-app-5f2dc",
  storageBucket: "attendance-app-5f2dc.firebasestorage.app",
  messagingSenderId: "279562243861",
  appId: "1:279562243861:web:452f475c3f687c8c65631c",
  measurementId: "G-ME5ZL9YWC8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);