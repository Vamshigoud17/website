import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADmb_G215FmUTsHMyp2MJl8KSr0Vprerg",
  authDomain: "webapp-ai.firebaseapp.com",
  projectId: "webapp-ai",
  storageBucket: "webapp-ai.appspot.com",
  messagingSenderId: "930882091738",
  appId: "1:930882091738:web:e4177e4808d8f3efd383e3",
  measurementId: "G-H8RR0HF4WN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);