import { FilterQuery } from 'mongoose';
import { ITask, Task } from '../models/task';
import { ITaskInstance, TaskInstance } from '../models/taskInstance';
import { generateExtendedInstances } from '../routes/ml';
import { compareArrays } from '../lib/common/helpers';

export const getTaskInstances = (params: FilterQuery<ITaskInstance>) =>
	TaskInstance.find(params);

export const getTaskWithInstances = (id: string) =>
	Task.findById(id)
		.then((task) => {
			TaskInstance.find({ taskId: task?._id }).then((taskInstances) => {
				return {
					task,
					taskInstances,
				};
			});
		})
		.catch((error) => {
			throw error;
		});

export const deleteTaskInstance = (params: { id: any }) =>
	TaskInstance.deleteOne({ taskId: params.id });

export const updateTaskInstance = async (params: { id: any }) => {
	try {
		const taskInstance = await TaskInstance.findById(params.id);
		if (taskInstance == null) {
			throw new Error('Task not found');
		}
		// map task instance properties and update

		const updatedTaskInstance = taskInstance.save();

		return updatedTaskInstance;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateTaskInstances = (instances: any) =>
	Promise.all([...instances].map((i) => updateTaskInstance(i))).then(
		(values) => values
	);

export const removeAdjustedInstances = async (params: ITask, task: ITask) => {
	// remove tasks not in days
	if (params.days)
		await TaskInstance.deleteMany({
			taskId: task.id,
			days: {
				$in: params.days.filter((d) => !task.days.includes(d)),
			},
		});

	// remove tasks not in range
	if (params.startDate > task.startDate)
		await TaskInstance.deleteMany({
			taskId: task.id,
			startDateTime: { $lt: params.startDate },
		});
	if (params.endDate > task.endDate)
		await TaskInstance.deleteMany({
			taskId: task.id,
			endDateTime: { $gt: params.endDate },
		});
};

/**
 *
 * - Get tasks outside of updated range && tasks if extended will conflict
 * - rangeConflicts: get tasks that start before /end after updated range
 * - extendedConflicts: idk...
 *
 */
export const updateExistingAdjustedInstances = async (
	params: ITask,
	task: ITask
) => {
	const rangeConflicts = await TaskInstance.aggregate([
		{
			$match: {
				taskId: task.id,
			},
		},
		{
			$addFields: {
				startHour: { $hour: '$startDateTime' },
				endHour: { $hour: '$endDateTime' },
			},
		},
		{
			$match: {
				$and: [
					{ startHour: { $lt: params.startHour } },
					{ endHour: { $gt: params.endHour } },
				],
			},
		},
	]);

	const conflictingInstances = await TaskInstance.find({
		taskId: { $ne: task.id }, // Exclude the taskId itself if needed (for updates)
		userId: task.userId, // Match user ID
		// $or: [
		// 	{
		// 		startDateTime: { $lt: endDateTime },
		// 		endDateTime: { $gt: startDateTime },
		// 	},
		// 	{
		// 		startDateTime: { $gte: startDateTime, $lt: endDateTime },
		// 	},
		// 	{
		// 		endDateTime: { $gt: startDateTime, $lte: endDateTime },
		// 	},
		// ],
	}).exec();

	const conflicts = [...rangeConflicts, ...conflictingInstances];
};

/**
 *
 * Get timeframe available to schedule before and after
 * Iterate through normal add instances fn
 */
export const addNewAdjustedInstances = async (params: ITask, task: ITask) => {
	const newAdjustedInstances = [];

	// get dates from extended start range
	if (params.startDate < task.startDate) {
		const newStartInstances = generateExtendedInstances(
			params.startDate,
			task.startDate,
			task
		);
		newAdjustedInstances.push(newStartInstances);
	}

	// get dates from extended end range
	if (params.endDate > task.endDate) {
		const newEndInstances = generateExtendedInstances(
			task.endDate,
			params.endDate,
			task
		);
		newAdjustedInstances.push(newEndInstances);
	}

	// get added weekdays
	const { newNums } = compareArrays(params.days, task.days);
	// get new instances to generate
	const specificDatesArr = [];
};
