import * as admin from 'firebase-admin';
import 'dotenv/config';

const serviceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

export const verifyIdToken = (token: string) => auth.verifyIdToken(token);
