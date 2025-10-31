// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

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
const storage = getStorage(app);

export { app, analytics, storage };

// Upload image to Firebase Storage
export async function uploadImage(dataUrl: string, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, dataUrl, 'data_url');
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

// Send note to webhook
export async function sendToWebhook(webhookUrl: string, payload: any): Promise<void> {
  if (!webhookUrl) {
    throw new Error('No webhook URL configured');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.statusText}`);
  }
}
