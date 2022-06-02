import { BodyProp, Inject, Post, Put, Route, Tags } from 'tsoa';
import { createTeam, updateTeamById } from '../database/team.odm';
import { updateTeamOperations } from '../utils/Enums';
import { BasicResponse } from '../utils/ResponsesTypes';
import { ITeamController } from './interfaces/teamController.interface';

@Route('/api/teams')
@Tags('TeamController')
export class TeamController implements ITeamController {
  // TODO: add examples, responses for documentation
  /**
   * Endpoint to create New Team
   * @param {string} leaderId User ID of who is creating the team
   * @returns {BasicResponse} Object with response status and confirmation or error message
   */
  @Post('/')
  async createNewTeam (@Inject() leaderId: string, @BodyProp('name') name: string): Promise<BasicResponse> {
    if (name) {
      return await createTeam({
        name,
        leader: leaderId,
        participants: [leaderId],
        todos: []
      });
    } else {
      return {
        status: 400,
        message: 'Please, provide the team\'s name'
      };
    }
  }

  /**
   * Endpoint to update a Team
   * @param {string} teamId Team to update
   * @param {updateTeamOperations} updateOperation Type of update operation
   * @param {any} data Data to update
   * @returns {BasicResponse} Object with response status and confirmation or error message
   */
  @Put('/')
  async updateTeam (@Inject() loggedUserId: string,
    @BodyProp('teamId') teamId: string,
    @BodyProp('updateOperation') updateOperation: updateTeamOperations,
    @BodyProp('data') data?: any): Promise<BasicResponse> {
    return await updateTeamById(loggedUserId, teamId, updateOperation, data);
  }
}
