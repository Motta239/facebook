import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBjvJGU8jHzubO9A27LK3NS4oQROJGiuB0',
  authDomain: 'instagram-clone-789cd.firebaseapp.com',
  projectId: 'instagram-clone-789cd',
  storageBucket: 'instagram-clone-789cd.appspot.com',
  messagingSenderId: '694595159088',
  appId: '1:694595159088:web:4bd9986b43a44cc04219f5',
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }


