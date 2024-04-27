// app.js

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import taskRouter from './routes/task';
import mlRouter from './routes/ml';

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
(async () => {
	try {
		await mongoose.connect(process.env.ME_CONFIG_MONGODB_URL || '');
		console.log('Connected to DB');
	} catch (error) {
		console.error('cannot connect to db: ', error);
	}

	// Start the server
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
})();

// Routes
app.use('/tasks', taskRouter);
app.use('/ml', mlRouter);
