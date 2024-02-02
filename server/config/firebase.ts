// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase-admin"
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const serviceAccount = require('../../firebase.json');

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'gs://foodi-app-8e777.appspot.com'
});

const db = getFirestore();
const storage = getStorage();
module.exports = { db, storage };