import express, { Request, Response } from 'express';
import { TodoController } from '../controllers/todo.controllers';
import verifyAdmin from '../middlewares/verifyAdmin.middleware';
import verifyToken from '../middlewares/verifyToken.middleware';
import { TodosResponse } from '../utils/ResponsesTypes';

const todoRouter = express.Router();

todoRouter.use(express.json());

todoRouter
  // To Get ToDos or one by ID
  .get('/', verifyAdmin, verifyToken, async (req: Request, res: Response) => {
    // Variables for controller
    const todoId: any = req.query?.id;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.getTodos(todoId);
    return res.status(response.status).send(response);
  })

  // To get logged user todos
  .get('/me', verifyToken, async (req: Request, res: Response) => {
    // Variables
    const userId: string = res.locals.userId;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.getMyTodos(userId);
    return res.status(response.status).send(response);
  })

  // To create a new ToDo
  .post('/', verifyToken, async (req: Request, res: Response) => {
    // Variables for controller
    const name: string | undefined = req.body?.name;
    const priority: string | undefined = req.body?.priority;
    const teamId: string | undefined = req.body?.teamId;
    const userId: string = res.locals.userId;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.createNewTodo(name, priority, userId, teamId);
    return res.status(response.status).send(response);
  })

  // To update a ToDo by ID
  // TODO: update only if you are the creator
  .put('/', verifyToken, async (req: Request, res: Response) => {
    // Variables for controller
    const todoId: any = req.query?.id;
    const name: string | undefined = req.body?.name;
    const priority: string | undefined = req.body?.priority;
    const completed: boolean | undefined = req.body?.completed;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.updateTodoById(todoId, name, priority, completed);
    return res.status(response.status).send(response);
  })

  // To delete a ToDo by ID
  // TODO: delete only if you are the creator
  .delete('/', verifyToken, async (req: Request, res: Response) => {
    // Variables for controller
    const todoId: any = req.query?.id;

    const controller: TodoController = new TodoController();
    const response: TodosResponse = await controller.deleteTodoById(todoId);
    return res.status(response.status).send(response);
  });

export default todoRouter;
