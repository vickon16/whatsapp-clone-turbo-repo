import { env } from "@/env";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "whatsapp-clone-5236d.firebaseapp.com",
  projectId: "whatsapp-clone-5236d",
  storageBucket: "whatsapp-clone-5236d.appspot.com",
  messagingSenderId: "100900169782",
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
