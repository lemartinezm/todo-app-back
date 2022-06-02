import express, { Request, Response } from 'express';
import { TeamController } from '../controllers/team.controllers';
import verifyToken from '../middlewares/verifyToken.middleware';

const teamRouter = express.Router();

teamRouter.use(express.json());

teamRouter
  // * To get my teams
  .get('/me', verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;

    const controller: TeamController = new TeamController();
    const response = await controller.getTeamsByParticipant(loggedUserId);
    return res.status(response.status).send(response);
  })

  // * To create new Team
  .post('/', verifyToken, async (req: Request, res: Response) => {
    const leaderId: any = res.locals.userId;
    const teamName: any = req.body?.teamName;

    const controller: TeamController = new TeamController();
    const response = await controller.createNewTeam(leaderId, teamName);
    return res.status(response.status).send(response);
  })

  // * To update existing team
  .put('/', verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;
    const teamId: any = req.body?.teamId;
    const updateOperation: any = req.body?.updateOperation;
    const data: any = req.body?.data;

    const controller: TeamController = new TeamController();
    const response = await controller.updateTeam(loggedUserId, teamId, updateOperation, data);
    return res.status(response.status).send(response);
  })

  // * To delete a Team
  .delete('/', verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;
    const teamId: any = req.body?.teamId;

    const controller: TeamController = new TeamController();
    const response = await controller.deleteTeam(loggedUserId, teamId);
    return res.status(response.status).send(response);
  });

export default teamRouter;
