import mongoose from 'mongoose';
import { ITodo } from '../interfaces/todo.interface';

export const todoEntity = () => {
  const todoSchema = new mongoose.Schema<ITodo>({
    name: { type: String, required: true },
    priority: { type: String, required: true },
    completed: { type: Boolean, required: true }
  });

  return mongoose.models.Todo || mongoose.model('Todo', todoSchema);
};
