import { model, Schema, Document, Types } from 'mongoose';

export interface ITaskInstanceModifiers {}

interface user {
	name: string;
	email: string;
	birthdate: Date;
}

interface userParams {
	name?: string;
	email?: string;
	birthdate?: Date;
}

// Define Task interface
export interface ITask {
	id?: string;
	name: string;
	userId?: string;
	description: string;
	duration: number;
	startDate: string;
	endDate: string;
	days: number[];
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	minWeeklyInstances?: number;
	maxWeeklyInstances?: number;
	gap: number;
	minInstancesPerDay?: number;
	maxInstancesPerDay?: number;
	taskInstances?: Types.ObjectId[];
}

export interface ITaskDocument extends Document {
	_id: string;
	name: string;
	userId?: string;
	description: string;
	duration: number;
	startDate: Date;
	endDate: Date;
	days: number[];
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	minWeeklyInstances?: number;
	maxWeeklyInstances?: number;
	gap: number;
	minInstancesPerDay?: number;
	maxInstancesPerDay?: number;
	taskInstances?: Types.ObjectId[];
}

// Define Task schema
const TaskSchema: Schema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	days: { type: [Number], required: true },
	startHour: { type: Number, required: true },
	startMinute: { type: Number, required: true },
	endHour: { type: Number, required: true },
	endMinute: { type: Number, required: true },
	minWeeklyInstances: { type: Number, default: 1 },
	maxWeeklyInstances: { type: Number, default: 5 },
	gap: { type: Number, default: 15 },
	minInstancesPerDay: { type: Number, default: 1 },
	maxInstancesPerDay: { type: Number, default: 1 },
	userId: { type: String },
	taskInstances: [{ type: Types.ObjectId, ref: 'TaskInstance' }],
});

export const Task = model<ITask>('Task', TaskSchema);
