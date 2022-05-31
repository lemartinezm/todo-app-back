import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LogError, LogSuccess } from '../utils/Logger';

dotenv.config();

/**
 * To Connect with MongoDB
 */
const dbConnect = () => {
  const { MONGOURI, MONGO_URI_TEST, NODE_ENV } = process.env;

  mongoose.connect(NODE_ENV === 'test' ? MONGO_URI_TEST! : MONGOURI!)
    .then(() => LogSuccess('[DB] Connected to DB'))
    .catch(error => { LogError(`[DB ERROR] Something went wrong. Details ${error}`); });
};

export default dbConnect;
