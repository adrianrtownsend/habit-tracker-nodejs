import mongoose from 'mongoose';

// Define a Mongoose schema for storing Google Calendar credentials
const credentialSchema = new mongoose.Schema({
	uid: { type: String, required: true, unique: true },
	access_token: String,
	refresh_token: String,
	token_type: String,
	expiry_date: Number,
});

// Create a Mongoose model for the credentials
export const Credential = mongoose.model('Credential', credentialSchema);
