import express, { Request, Response } from 'express';
import { TodoController } from '../controllers/todo.controllers';
import { TodosResponse } from '../utils/ResponsesTypes';

const todoRouter = express.Router();

todoRouter.use(express.json());

todoRouter
  // To Get ToDos
  .get('/', async (req: Request, res: Response) => {
    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.getTodos();
    return res.status(response.status).send(response);
  })

  // To create a new ToDo
  .post('/', async (req: Request, res: Response) => {
    // Obtain variables for controller
    const name: string | undefined = req.body?.name;
    const priority: string | undefined = req.body?.priority;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.createNewTodo(name, priority);
    return res.status(response.status).send(response);
  })

  // To update a ToDo
  .put('/', async (req: Request, res: Response) => {
    const id: any = req.query?.id;
    const name: string | undefined = req.body?.name;
    const priority: string | undefined = req.body?.priority;
    const completed: boolean | undefined = req.body?.completed;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.updateTodoById(id, name, priority, completed);
    return res.status(response.status).send(response);
  });

export default todoRouter;
