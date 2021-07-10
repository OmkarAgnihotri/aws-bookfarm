import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAzp03xxzT3g--DnPYDC-f4YufNKeJkvvU",
  authDomain: "book-farm.firebaseapp.com",
  projectId: "book-farm",
  storageBucket: "book-farm.appspot.com",
  messagingSenderId: "736630526150",
  appId: "1:736630526150:web:ca3ce14c472a0e30b587c7",
  measurementId: "G-BC9C8GBH0Q"
};
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();

  export const authProviders = {
      googleAuthProvider : new firebase.auth.GoogleAuthProvider()
  }

  export const firestoreDB = firebase.firestore();
