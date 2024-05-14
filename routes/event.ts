import express from 'express';
import { Task } from '../models/task';

const eventRouter = express.Router();

/**
 *
 * Need to get auth passed from middleware
 */
eventRouter.get('/', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.json(tasks);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

export default eventRouter;
