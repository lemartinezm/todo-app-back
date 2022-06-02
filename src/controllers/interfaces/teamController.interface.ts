import { updateTeamOperations } from '../../utils/Enums';
import { BasicResponse, TeamResponse } from '../../utils/ResponsesTypes';

export interface ITeamController {
  getTeamsByParticipant(loggedUserId: string): Promise<TeamResponse>;
  createNewTeam(leaderId: string, name: string): Promise<BasicResponse>;
  updateTeam(loggedUserId: string, teamId: string, updateOperation: updateTeamOperations, data?: any): Promise<BasicResponse>;
  deleteTeam(loggedUserId: string, teamId: string): Promise<BasicResponse>;
}
