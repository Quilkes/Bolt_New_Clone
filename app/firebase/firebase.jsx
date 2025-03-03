// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvuISRHk1UNoQGK1Z_hiD3att3x1Wetas",
  authDomain: "holtex-ai.firebaseapp.com",
  projectId: "holtex-ai",
  storageBucket: "holtex-ai.firebasestorage.app",
  messagingSenderId: "298127846446",
  appId: "1:298127846446:web:177d78b2cd759d187543bf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
