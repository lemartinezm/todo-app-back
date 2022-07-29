import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controllers';
import verifyRepeatedData from '../middlewares/verifyRepeatedData.middleware';
import { BasicResponse, LoginResponse } from '../utils/ResponsesTypes';

const authRouter = express.Router();

authRouter.use(express.json());

authRouter
  // * To register user
  .post('/register', verifyRepeatedData, async (req: Request, res: Response) => {
    // Variables
    const username: any = req.body?.username;
    const email: any = req.body?.email;
    const password: any = req.body?.password;

    const controller: AuthController = new AuthController();
    const response: BasicResponse = await controller.registerNewUser(username, email, password);

    return res.status(response.status).send(response);
  })
  // * To login user
  .post('/login', async (req: Request, res: Response) => {
    // Variables
    const username: any = req.body?.username;
    const email: any = req.body?.email;
    const password: any = req.body?.password;

    const controller: AuthController = new AuthController();
    const response: LoginResponse = await controller.loginUser(password, username, email);

    return res.status(response.status).send(response);
  });

export default authRouter;
