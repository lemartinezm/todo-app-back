import express, { Request, Response } from 'express';
import todoRouter from './TodoRoute';

// For the home page from API (http://localhost:3000)
const rootRouter = express.Router();

rootRouter.get('/', (req: Request, res: Response) => {
  return res.send({
    message: 'Welcome to ToDo App API'
  });
});

// For redirections in diferents routers for differents nested routes from '/api'
const server = express();

server.use('/', rootRouter);
server.use('/todos', todoRouter);

export default server;
