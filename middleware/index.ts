import { Response, Request, NextFunction } from 'express';
import { verifyIdToken } from '../auth/firebase';

export const verifyAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization || '';
	await verifyIdToken(token);
	next();
};
