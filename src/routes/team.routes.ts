import express, { Request, Response } from 'express';
import { TeamController } from '../controllers/team.controllers';
import verifyToken from '../middlewares/verifyToken.middleware';

const teamRouter = express.Router();

teamRouter.use(express.json());

teamRouter
  // * To get my teams
  .get('/me', verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;
    const documentsPerPage: any = req.query?.documentsPerPage || 10;
    const currentPage: any = req.query?.currentPage || 1;

    const controller: TeamController = new TeamController();
    const response = await controller.getTeamsByParticipant(loggedUserId, parseInt(documentsPerPage), parseInt(currentPage));
    return res.status(response.status).send(response);
  })

  // * To create new Team
  .post('/', verifyToken, async (req: Request, res: Response) => {
    const leaderId: any = res.locals.userId;
    const teamName: any = req.body?.teamName;
    const participants: any = req.body?.participants;

    const controller: TeamController = new TeamController();
    const response = await controller.createNewTeam(leaderId, teamName, participants);
    return res.status(response.status).send(response);
  })

  // * To update existing team
  .put('/', verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;
    const updatedTeam: any = req.body?.updatedTeam;

    const controller: TeamController = new TeamController();
    const response = await controller.updateTeam(loggedUserId, updatedTeam);
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
