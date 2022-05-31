import mongoose from 'mongoose';
import { CreateTodoSchema } from '../interfaces/todo.interface';

export const todoEntity = () => {
  const todoSchema = new mongoose.Schema<CreateTodoSchema>({
    name: { type: String, required: true },
    priority: { type: String, required: true },
    completed: { type: Boolean, required: true }
  });

  return mongoose.models.Todo || mongoose.model('Todo', todoSchema);
};
