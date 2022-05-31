import express, { Request, Response } from 'express';
import todoRouter from './todo.routes';

// For the home page from API (http://localhost:3000)
const homeRouter = express.Router();

homeRouter.get('/', (req: Request, res: Response) => {
  return res.status(200).send({
    status: 200,
    message: 'Welcome to ToDo App API'
  });
});

// For redirections in diferents routers for differents nested routes from '/api'
const rootRouter = express();

rootRouter.use('/', homeRouter);
rootRouter.use('/todos', todoRouter);

export default rootRouter;
