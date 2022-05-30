import express, { Request, Response } from 'express';
import { TodoController } from '../controllers/TodoController';
import { TodosResponse } from '../utils/ResponsesTypes';

const todoRouter = express.Router();

todoRouter.use(express.json());

todoRouter
  .get('/', async (req: Request, res: Response) => {
    const controller: TodoController = new TodoController();

    const response: TodosResponse = await controller.getAllTodos();

    return res.status(response.status).send(response);
  });

export default todoRouter;
