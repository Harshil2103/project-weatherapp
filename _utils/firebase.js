
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOanTE2ZjL02krl26M8Xd67icqkrexceQ",
  authDomain: "project-weatherapp.firebaseapp.com",
  projectId: "project-weatherapp",
  storageBucket: "project-weatherapp.appspot.com",
  messagingSenderId: "353269176826",
  appId: "1:353269176826:web:39b47e9fdd0bfd2fbd6c43"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
