// app.js

import express, { ErrorRequestHandler, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

import taskRouter from './routes/task';
import eventRouter from './routes/event';
import taskInstanceRouter from './routes/taskInstance';
import { verifyAuth } from './auth/firebase';
import { inititalizeDB } from './db';
import { seedDB } from './seeders';
import userRouter from './routes/user';

const app = express();
const PORT = process.env.BACKEND_PORT ?? 8080;

app.use(cors());
app.use(bodyParser.json());

(async () => {
	try {
		await inititalizeDB();
		console.log('Connected to DB');
	} catch (error) {
		console.error('cannot connect to db: ', error);
	}

	try {
		await seedDB();
		console.log('Database Seeded');
	} catch (error) {
		console.log('cannot seed db: ', error);
	}

	// Start the server
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});

	// Middleware
	// app.use(verifyAuth);

	// error handler
	// app.use((err: ErrorRequestHandler, req: Request, res: Response) => {
	// 	res.status(400).json({ message: err });
	// });

	// Routes
	app.use('/tasks', taskRouter);
	app.use('/taskInstances', taskInstanceRouter);
	app.use('/events', eventRouter);
	app.use('/users', userRouter);
})();
