import express, { Request, Response } from 'express';
import { TodoController } from '../controllers/todo.controllers';
import { TodosResponse } from '../utils/ResponsesTypes';

const todoRouter = express.Router();

todoRouter.use(express.json());

todoRouter
  // To Get ToDos or one by ID
  .get('/', async (req: Request, res: Response) => {
    // Variables for controller
    const id: any = req.query?.id;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.getTodos(id);
    return res.status(response.status).send(response);
  })

  // To create a new ToDo
  .post('/', async (req: Request, res: Response) => {
    // Variables for controller
    const name: string | undefined = req.body?.name;
    const priority: string | undefined = req.body?.priority;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.createNewTodo(name, priority);
    return res.status(response.status).send(response);
  })

  // To update a ToDo by ID
  .put('/', async (req: Request, res: Response) => {
    // Variables for controller
    const id: any = req.query?.id;
    const name: string | undefined = req.body?.name;
    const priority: string | undefined = req.body?.priority;
    const completed: boolean | undefined = req.body?.completed;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.updateTodoById(id, name, priority, completed);
    return res.status(response.status).send(response);
  })

  // To delete a ToDo by ID
  .delete('/', async (req: Request, res: Response) => {
    // Variables for controller
    const id: any = req.query?.id;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.deleteTodoById(id);
    return res.status(response.status).send(response);
  });

export default todoRouter;
