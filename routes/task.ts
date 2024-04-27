import express from 'express';
import { Task } from '../models/task';

const taskRouter = express.Router();

taskRouter.get('/', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.json(tasks);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

taskRouter.post('/', async (req, res) => {
	const task = new Task({
		name: req.body.name,
		description: req.body.description,
		is_completed: req.body.is_completed,
	});
	try {
		const newTask = await task.save();
		res.status(201).json(newTask);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
});

taskRouter.put('/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (task == null) {
			return res.status(404).json({ message: 'Task not found' });
		}
		if (req.body.name != null) {
			task.name = req.body.name;
		}
		if (req.body.description != null) {
			task.description = req.body.description;
		}
		if (req.body.is_completed != null) {
			task.is_completed = req.body.is_completed;
		}
		const updatedTask = await task.save();
		res.json(updatedTask);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
});

taskRouter.delete('/:id', async (req, res) => {
	try {
		await Task.findByIdAndDelete(req.params.id);
		res.json({ message: 'Task deleted' });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

export default taskRouter;
