import { model, Schema } from 'mongoose';

interface ITask {
	name: string;
	description: string;
	is_completed: boolean;
}

const taskSchema = new Schema<ITask>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	is_completed: { type: Boolean, required: true },
});

export const Task = model<ITask>('Task', taskSchema);
