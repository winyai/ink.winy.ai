// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsL5sSh3pODwxN3XABTGLkBG5_urw5PCg",
  authDomain: "ink-winy-ai.firebaseapp.com",
  projectId: "ink-winy-ai",
  storageBucket: "ink-winy-ai.firebasestorage.app",
  messagingSenderId: "350240685051",
  appId: "1:350240685051:web:510d57a39b9dfa1633e95e",
  measurementId: "G-RL7W1ND620"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
