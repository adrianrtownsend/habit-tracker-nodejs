// seeder/index.ts

import { Task } from '../models/task';
import { TaskInstance } from '../models/taskInstance';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import sampleOne from './sample-one.json';
import { createTask } from '../services/task';
import axios from 'axios';

/**
 * clear DB & tables
 * create seed objects from sample
 *
 * - parse json arr
 * - iterate through objects
 * - update start/endDates to start today
 */

export const seedDB = async () => {
	try {
		// Clear existing data
		await Task.deleteMany({});
		await TaskInstance.deleteMany({});
		await User.deleteMany({});

		// Create users with auto-generated GUIDs
		const users = [];
		for (let i = 0; i < sampleOne.length; i++) {
			const user = new User({
				name: `User${i + 1}`,
				email: `user${i + 1}@example.com`,
				status: 1,
				firebaseId: uuidv4(),
			});
			await user.save();
			users.push(user);
		}

		// Create tasks and associate them with users
		for (let i = 0; i < sampleOne.length; i++) {
			const task = {
				...sampleOne[i],
			};
			await createTask(task, users[i]);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};
