import { updateTeamOperations } from '../../utils/Enums';
import { BasicResponse } from '../../utils/ResponsesTypes';

export interface ITeamController {
  createNewTeam(leaderId: string, name: string): Promise<BasicResponse>;
  updateTeam(loggedUserId: string, teamId: string, updateOperation: updateTeamOperations, data?: any): Promise<BasicResponse>
}
