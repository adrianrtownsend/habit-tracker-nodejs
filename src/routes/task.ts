import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../services/task';
import { AuthRequest } from '../auth/firebase';
import { getTaskWithInstances } from '../services/taskInstance';

const taskRouter = express.Router();

taskRouter.get('/', async (req, res) => {
	try {
		const tasks = await getTasks(req.body.task);
		res.json(tasks);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

taskRouter.post('/', async (req, res) => {
	const task = await createTask(req.body.task, (req as AuthRequest).user);
	res.status(200).json(task);
});

taskRouter.put('/', async (req, res) => {
	try {
		const updatedTask = await updateTask(req.body);
		res.json(updatedTask);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
});

taskRouter.delete('/', async (req, res) => {
	try {
		await deleteTask(req.body);
		res.json({ message: 'Task deleted' });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

taskRouter.get('/:id', async (req, res) => {
	try {
		const taskWithInstances = await getTaskWithInstances(req.params.id);
		res.json(taskWithInstances);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

export default taskRouter;
