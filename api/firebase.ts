import dotenv from 'dotenv';
import admin from 'firebase-admin';
// Load environmental variables
dotenv.config({});

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string;

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
});

export { firebaseApp };
