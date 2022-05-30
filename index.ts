import server from './src/server';
import dotenv from 'dotenv';
import { LogError, LogSuccess } from './src/utils/Logger';

dotenv.config();
const PORT = process.env.PORT;

server.listen(PORT, () => {
  LogSuccess(`Server deployed on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  LogError(`[SERVER] Something went wrong: ${error}`);
});
