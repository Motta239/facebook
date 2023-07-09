import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCvqpf2WIGnny-IAaNufppQ90qiswsCTvs",
  authDomain: "facebook-9b019.firebaseapp.com",
  projectId: "facebook-9b019",
  storageBucket: "facebook-9b019.appspot.com",
  messagingSenderId: "126187023264",
  appId: "1:126187023264:web:f29c68666a120b759452c5"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }


