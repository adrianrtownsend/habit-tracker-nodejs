import express from 'express';
import { getUsers } from '../services/user';
import { AuthRequest } from '../auth/firebase';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
	try {
		const users = await getUsers(req.body.user);
		res.json(users);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

export default userRouter;
