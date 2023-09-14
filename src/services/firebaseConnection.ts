import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBQHrgNLxHde8SBszKGH1ZMCZnXYxydn98",
  authDomain: "exactpec.firebaseapp.com",
  projectId: "exactpec",
  storageBucket: "exactpec.appspot.com",
  messagingSenderId: "821893891666",
  appId: "1:821893891666:web:15377e0d3ec8798cf4018b",
  measurementId: "G-EBS7D4HSH8"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

