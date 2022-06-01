import express, { Request, Response } from 'express';
import { UserController } from '../controllers/user.controllers';

const userRouter = express.Router();

userRouter.use(express.json());

userRouter
  // To get all users or one by ID
  .get('/', async (req: Request, res: Response) => {
    // Obtain variables
    const id: any = req.query?.id;

    const controller: UserController = new UserController();
    const response = await controller.getUsers(id);

    return res.status(response.status).send(response);
  })
  // To create User
  .post('/', async (req: Request, res: Response) => {
    // Variables
    const username: any = req.body?.username;
    const email: any = req.body?.email;
    const password: any = req.body?.password;

    const controller: UserController = new UserController();
    const response = await controller.createNewUser(username, email, password);

    return res.status(response.status).send(response);
  })
  // To update User
  .put('/', async (req: Request, res: Response) => {
    // Variables
    const id: any = req.query?.id;
    const username: any = req.body?.username;
    const email: any = req.body?.email;
    const password: any = req.body?.password;

    const controller: UserController = new UserController();
    const response = await controller.updateUser(id, username, email, password);

    return res.status(response.status).send(response);
  })
  // To delete User
  .delete('/', async (req: Request, res: Response) => {
    // Variables
    const id: any = req.query?.id;

    const controller: UserController = new UserController();
    const response = await controller.deleteUser(id);

    return res.status(response.status).send(response);
  });

export default userRouter;
