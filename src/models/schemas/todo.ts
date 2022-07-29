import mongoose from 'mongoose';
import { TodoPriority } from '../../utils/Enums';
import { CreateTodoSchema } from '../interfaces/todo.interface';

export const todoEntity = () => {
  const todoSchema = new mongoose.Schema<CreateTodoSchema>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    createdAt: { type: Date, required: true },
    deadline: { type: Date, required: false },
    priority: { type: String, required: true, enum: [TodoPriority.LOW, TodoPriority.NORMAL, TodoPriority.HIGH] },
    completed: { type: Boolean, required: true },
    creator: { type: mongoose.SchemaTypes.ObjectId, required: true },
    teamId: { type: mongoose.SchemaTypes.ObjectId, required: false }
  });

  return mongoose.models.Todo || mongoose.model<CreateTodoSchema>('Todo', todoSchema);
};
