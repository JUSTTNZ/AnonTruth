import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
    apiKey: "AIzaSyDjQYzTKid2JTOs_VwVHztr8sO3cqI5cUM",
    authDomain: "chat-app-321cb.firebaseapp.com",
    projectId: "chat-app-321cb",
    storageBucket: "chat-app-321cb.firebasestorage.app",
    messagingSenderId: "290327068207",
    appId: "1:290327068207:web:bc1f0e4aadfa03f91250da",
    measurementId: "G-T6V5W4M4W8"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, firestore, storage, database };