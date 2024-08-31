import mongoose from 'mongoose';

// Todo Schema
const todoSchema = new mongoose.Schema({
	todo_name: String,
	todo_description: String,
	is_completed: Boolean,
});

export const Todo = mongoose.model('Todo', todoSchema);
