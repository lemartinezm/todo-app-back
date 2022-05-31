import mongoose from 'mongoose';
import { TodoSchema } from '../interfaces/todo.interface';

export const todoEntity = () => {
  const todoSchema = new mongoose.Schema<TodoSchema>({
    name: { type: String, required: true },
    priority: { type: String, required: true },
    completed: { type: Boolean, required: true }
  });

  return mongoose.models.Todo || mongoose.model('Todo', todoSchema);
};
