import { model, Schema, Document, Types } from 'mongoose';

// Define TaskInstance interface
export interface ITaskInstance {
	userId?: string;
	status: number;
	startDateTime: string;
	endDateTime: string;
	taskId?: Types.ObjectId;
}

export interface ITaskInstanceDocument extends Document {
	_id: string;
	userId?: string;
	status: number;
	startDateTime: Date;
	endDateTime: Date;
	taskId: Types.ObjectId;
}

// Define Instance schema
const TaskInstanceSchema: Schema = new Schema({
	userId: { type: String },
	status: { type: Number, default: 0, enum: [0, 1, 2, 3] },
	startDateTime: { type: Date, required: true },
	endDateTime: { type: Date, required: true },
	taskId: { type: Types.ObjectId, ref: 'Task', required: true },
});

export const TaskInstance = model<ITaskInstanceDocument>(
	'TaskInstance',
	TaskInstanceSchema
);
