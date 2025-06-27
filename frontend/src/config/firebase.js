import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMwxQHedCI16934FB-_MzgtiWtg431bPo",
  authDomain: "re-event-7802c.firebaseapp.com",
  projectId:"re-event-7802c",
  storageBucket: "re-event-7802c.firebasestorage.app",
  messagingSenderId: "683331621855",
  appId: "1:683331621855:web:8028a5dfb38535832eea6a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Export sign-in function with better error handling
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider).catch((error) => {
    // Handle popup blocked errors
    if (error.code === "auth/popup-blocked") {
      console.log("Popup blocked, trying redirect...");
      // Could implement redirect method here if needed
    }
    throw error;
  });
};
export default app;
