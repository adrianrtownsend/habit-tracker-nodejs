import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const mlRouter = express.Router();

const mlInstance = axios.create({
	baseURL: process.env.ML_URL,
});

mlRouter.get('/sort', async (req, res) => {
	try {
		const { numbers, order } = req.body;

		// Call Python API
		const response = await mlInstance.post(`/sort`, {
			numbers,
			order,
		});

		// Return the response from Python API
		res.json(response.data);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

mlRouter.get('/sort', (req, res) => {
	res.json('sort hit');
});

// Task request
mlRouter.post('/task', async (req, res) => {
	try {
		const { tasks } = req.body;
		const instances: any = [];

		const response = await mlInstance.post(`/create_task`, {
			tasks,
			instances,
		});
		console.log('res: ', response);

		res.json({ message: 'hit' });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default mlRouter;
