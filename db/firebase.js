const fireabse = require('firebase');
const admin = require('firebase-admin');
const serviceAccount = require('./config/ww-service-account.json');

const fireabseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const usersRef = db.collection('users');
const citiesRef = db.collection('cities');
const destinationsRef = db.collection('destinations');

const destinationByCityRef = db.collection('cities').doc('S0ACAgkp9MZqEtk1duLW').collection('destinations');

firebase.initializeApp(fireabseConfig);

module.exports = {
  firebase,
  db,
  admin,
  usersRef,
  citiesRef,
  destinationsRef,
  destinationByCityRef,
}