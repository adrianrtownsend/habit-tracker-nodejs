import { model, Schema, Document } from 'mongoose';

export interface IUser {
	name: string;
	email: string;
	status: number;
	firebaseId: string;
}

// Define User interface
export interface IUserDocument extends Document {
	_id: string;
	name: string;
	email: string;
	status: number;
	firebaseId: string;
}

// Define User schema
const UserSchema: Schema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	status: { type: Number, required: true },
	firebaseId: { type: String, required: true },
});

export const User = model<IUser>('User', UserSchema);
