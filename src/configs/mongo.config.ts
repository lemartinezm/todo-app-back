import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LogError, LogSuccess } from '../utils/Logger';

dotenv.config();

/**
 * To Connect with MongoDB
 */
const dbConnect = () => {
  const MONGOURI: string | undefined = process.env.MONGOURI;

  try {
    if (MONGOURI) {
      mongoose.connect(MONGOURI)
        .then(() => LogSuccess('[DB] Connected to DB'))
        .catch(error => { throw new Error(error); });
    } else {
      throw new Error('Missing URI to connection with DB');
    }
  } catch (error) {
    LogError(`[DB ERROR] Something went wrong. Details ${error}`);
  }
};

export default dbConnect;
