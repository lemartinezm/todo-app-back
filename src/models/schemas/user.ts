import mongoose from 'mongoose';
import { CreateUserSchema } from '../interfaces/user.interface';

export const userEntity = () => {
  const userSchema = new mongoose.Schema<CreateUserSchema>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    todos: { type: [], required: true }
  });

  return mongoose.models.User || mongoose.model('User', userSchema);
};
