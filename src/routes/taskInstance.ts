import express, { Request, Response } from 'express';
import { TaskInstance } from '../models/taskInstance';

const taskInstanceRouter = express.Router();

const getTaskInstance = (req: Request, res: Response) =>
	new Promise(async (resolve, reject) => {
		let taskInstance;
		try {
			taskInstance = await TaskInstance.findById(req.params.id);
			if (!taskInstance) {
				reject({ message: 'Task instance not found' });
			}
		} catch (error: any) {
			reject(error);
		}
		resolve(taskInstance);
	});

taskInstanceRouter.get('/', async (req, res) => {
	try {
		const taskInstances = await TaskInstance.find();
		res.json(taskInstances);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
});

taskInstanceRouter.get('/:id', async (req, res) => {
	try {
		const taskInstance = await getTaskInstance(req, res);
		res.json(taskInstance);
	} catch (error: any) {
		res.json(400).json({ message: error.message });
	}
});

taskInstanceRouter.post('/', async (req, res) => {
	try {
		const taskInstance = new TaskInstance(req.body);
		await taskInstance.save();
		res.status(201).json(taskInstance);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

taskInstanceRouter.put('/:id', async (req, res) => {
	try {
		// const taskInstance = await getTaskInstance(req, res);
		const taskInstance = await TaskInstance.findById(req.params.id);
		if (taskInstance == null) {
			return res.status(404).json({ message: 'TaskInstance not found' });
		}
		const updatedTaskInstance = await taskInstance.save();
		res.json(updatedTaskInstance);
	} catch (error: any) {
		res.json(400).json({ message: error.message });
	}
});

taskInstanceRouter.delete('/:id', async (req, res) => {
	try {
		await TaskInstance.findByIdAndDelete(req.params.id);
		res.json({ message: 'Task deleted' });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

export default taskInstanceRouter;
