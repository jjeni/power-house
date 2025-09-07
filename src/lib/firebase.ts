import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  getRedirectResult, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence

} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // CRITICAL: Use your actual domain as authDomain instead of the default .firebaseapp.com
  // This fixes the third-party storage blocking issue in modern browsers
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Provider with additional parameters for better mobile experience
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
  // Add these parameters for better mobile handling
  hd: undefined, // Remove hosted domain restriction if any
});

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { signInWithPopup, signOut, onAuthStateChanged, signInWithRedirect, getRedirectResult, setPersistence, browserLocalPersistence};