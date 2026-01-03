import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCwWzoVV6cxhY7ePb4jwAHcAIylgXdxNEQ",
  authDomain: "diabetes-predictor-ba465.firebaseapp.com",
  projectId: "diabetes-predictor-ba465",
  storageBucket: "diabetes-predictor-ba465.firebasestorage.app",
  messagingSenderId: "324935304014",
  appId: "1:324935304014:web:beb5efa19fa956f9b7541f",
  measurementId: "G-EJ18YFEQLL",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
