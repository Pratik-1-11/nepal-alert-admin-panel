
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBnyWeCsexyL-XY1Zg0OGrizuEvijWiJD4",
  authDomain: "disastermgmt-5c317.firebaseapp.com",
  projectId: "disastermgmt-5c317",
  storageBucket: "disastermgmt-5c317.firebasestorage.app",
  messagingSenderId: "13591525828",
  appId: "1:13591525828:web:e7e02746b3d5f8c6f24c91",
  measurementId: "G-L9TRQSD73Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
