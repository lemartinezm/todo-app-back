import express, { Request, Response } from 'express';
import authRouter from './auth.routes';
import todoRouter from './todo.routes';
import userRouter from './user.routes';
import cors from 'cors';
import teamRouter from './team.routes';

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

rootRouter.use(cors());
rootRouter.use('/', homeRouter);
rootRouter.use('/todos', todoRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/teams', teamRouter);

export default rootRouter;
