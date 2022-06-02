import mongoose from 'mongoose';
import { CreateTeamSchema } from '../interfaces/team.interface';

/**
 * Team Entity
 * @returns Mongoose model for petitions
 */
export const teamEntity = () => {
  const teamSchema = new mongoose.Schema<CreateTeamSchema>({
    name: { type: String, required: true },
    leader: { type: mongoose.SchemaTypes.ObjectId, required: true },
    participants: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    todos: { type: [mongoose.SchemaTypes.ObjectId], required: true }
  });

  return mongoose.models.Team || mongoose.model('Team', teamSchema);
};
