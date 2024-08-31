import * as admin from 'firebase-admin';
import { Response, Request, NextFunction } from 'express';
import 'dotenv/config';
import { IUser } from '../models/user';

export interface AuthUser extends IUser {
	token?: admin.auth.DecodedIdToken;
}

export interface AuthRequest extends Request {
	user: AuthUser;
}

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	}),
});

const auth = admin.auth();

export const verifyAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization ?? '';
	try {
		const user = await auth.verifyIdToken(token);
		res.locals.user = user;
		next();
	} catch (error) {
		res.status(400).json({ message: error });
	}
};
