// src/firebase.js
// Initialize Firebase — fill in your values in .env (copy from .env.example)
// The app renders with static data even without Firebase credentials.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


let db = null;
let auth = null;
let storage = null;


const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

if (apiKey && apiKey !== 'your-api-key-here') {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

  } catch (e) {
    console.warn('[Firebase] Initialization failed — running in offline/demo mode.', e.message);
  }
} else {
  console.info(
    '[Delejaipur] Firebase not configured. Copy .env.example → .env and fill in your credentials to enable Firestore & Auth.'
  );
}

export { db, auth, storage };
