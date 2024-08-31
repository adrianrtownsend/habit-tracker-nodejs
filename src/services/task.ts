import { FilterQuery } from 'mongoose';
import { ITask, Task } from '../models/task';
import { TaskInstance } from '../models/taskInstance';
import { generateTaskInstances } from '../routes/ml';
import { AuthUser } from '../auth/firebase';
import {
	addNewAdjustedInstances,
	getTaskInstances,
	removeAdjustedInstances,
	updateExistingAdjustedInstances,
} from './taskInstance';

/**
 * - iterate through tasks; pluck each startDate/endDate
 * - get min startDate, max endDate
 * - get all task instances for user in date range
 * - generate new instances from ml
 * - create new task for each instance
 */
export const createTask = async (task: ITask, user: AuthUser) => {
	// get sorted user task instances [within defined date params]
	// get user tasks and taskInstances within date range
	try {
		const userId = user?.firebaseId || '1';

		// get user task instances from time range
		const taskInstances = await getTaskInstances({
			userId,
			startDate: task.startDate,
			endDate: task.endDate,
		});

		const instances = generateTaskInstances({
			task,
			task_instances: taskInstances,
		});

		// create task
		const newTask = await Task.create({ ...task, userId });
		// create taskInstances
		const newInstances = await TaskInstance.create(
			instances.map((i) => ({
				...i,
				taskId: newTask._id,
				userId: newTask.userId,
			}))
		);
		const createdTasks = { task: newTask, instances: newInstances };

		// save new task and instances
		return createdTasks;
	} catch (error) {
		console.log('error: ', error);
		throw error;
	}
};

export const getTasks = (params: FilterQuery<ITask>) => Task.find(params);

export const updateTask = async (params: ITask) => {
	const task = await Task.findById({ _id: params.id });
	if (task == null) {
		throw new Error('Task not found');
	}
	if (params.name != null) {
		task.name = params.name;
	}
	if (params.description != null) {
		task.description = params.description;
	}

	// update any task.instance[] if specific params passed
	const instanceParams = [
		'days',
		'startDate',
		'endDate',
		'duration',
		'startHour',
		'endHour',
	];

	const updateInstances = Object.entries(params).find(([key]) =>
		instanceParams.find((i) => i === key)
	);

	// if instance params are included adjust instances
	if (updateInstances) {
		await removeAdjustedInstances(params, task);
		await updateExistingAdjustedInstances(params, task);
		await addNewAdjustedInstances(params, task);
	}

	await task.save();
	return task;
};

export const deleteTask = (params: { id: any }) =>
	TaskInstance.deleteMany({ taskId: params.id })
		.then(() => {
			Task.findByIdAndDelete(params.id).then(() => params.id);
		})
		.catch((error) => {
			throw error;
		});
