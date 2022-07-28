import { BodyProp, Delete, Example, Get, Inject, Post, Put, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { createTeam, deleteTeamById, getTeamsByParticipantId, updateTeamById } from '../database/team.odm';
import { updateTeamOperations } from '../utils/Enums';
import { BasicResponse, TeamResponse } from '../utils/ResponsesTypes';
import { ITeamController } from './interfaces/teamController.interface';

// Example object for error petitions
const errorExample: TeamResponse = {
  status: 400,
  message: 'Error: Something went wrong'
};

@Route('/api/teams')
@Tags('TeamController')
export class TeamController implements ITeamController {
  /**
   * Endpoint to get teams for logged user
   * @param {string} loggedUserId Logged User ID
   * @returns {TeamResponse} Object with response status and teams or error message
   */
  @Get('/me')
  @SuccessResponse(200, 'Teams obtained successfully')
  @Response<TeamResponse>(400, 'Something went wrong', errorExample)
  @Example<TeamResponse>({
    status: 200,
    teams: [
      {
        _id: '62991758c2c45fea46143d93',
        name: 'Las estrellitas',
        leader: {
          _id: '6297fa2fb070244515773b8c',
          username: 'martin',
          email: 'martin@email.com'
        },
        participants: [
          {
            _id: '6297fa2fb070244515773b8c',
            username: 'martin',
            email: 'martin@email.com'
          }
        ],
        todos: [
          {
            _id: '62bfafb598899f7e90e68b9b',
            name: 'This is my new ToDo',
            description: 'This is a description example',
            createdAt: '2022-07-02T02:38:45.826Z',
            deadline: '2022-07-03T00:00:00.000Z',
            priority: 'low',
            completed: false,
            creator: '6297fa2fb070244515773b8c',
            __v: 0
          },
          {
            _id: '62c4fdc912d4b095433ee5fa',
            name: 'This is my new ToDo',
            description: 'This is a description example',
            createdAt: '2022-07-06T03:13:13.171Z',
            deadline: '2022-07-05T00:00:00.000Z',
            priority: 'low',
            completed: false,
            creator: '6297fa2fb070244515773b8c',
            __v: 0
          }
        ],
        __v: 0
      },
      {
        _id: '6299175cc2c45fea46143d95',
        name: 'Las burbujitas',
        leader: {
          _id: '6297fa2fb070244515773b8c',
          username: 'jorge',
          email: 'jorge@email.com'
        },
        participants: [
          {
            _id: '6297fa2fb070244515773b8c',
            username: 'jorge',
            email: 'jorge@email.com'
          }
        ],
        todos: [
          {
            _id: '62dc92c893615bf7dcd7bc33',
            name: 'Fourth Kata',
            description: '',
            createdAt: '2022-07-24T00:31:04.081Z',
            deadline: '2022-07-24T00:23:25.042Z',
            priority: 'normal',
            completed: false,
            creator: '6297fa51b070244515773b8e',
            __v: 0
          },
          {
            _id: '62dc930493615bf7dcd7bc4d',
            name: 'My new todo',
            description: '',
            createdAt: '2022-07-24T00:32:04.408Z',
            deadline: '2022-07-24T00:23:25.042Z',
            priority: 'normal',
            completed: false,
            creator: '6297fa51b070244515773b8e',
            __v: 0
          }
        ],
        __v: 0
      }
    ]
  })
  async getTeamsByParticipant (@Inject() loggedUserId: string): Promise<TeamResponse> {
    return await getTeamsByParticipantId(loggedUserId);
  }

  /**
   * Endpoint to create New Team
   * @param {string} leaderId User ID of who is creating the team
   * @param {string[]} participants Usernames of the participants
   * @returns {BasicResponse} Object with response status and confirmation or error message
   */
  @Post('/')
  @SuccessResponse(201)
  @Response<TeamResponse>(400, 'Something went wrong', errorExample)
  @Example<TeamResponse>({
    status: 201,
    message: 'Team created successfully'
  })
  async createNewTeam (@Inject() leaderId: string,
   @BodyProp('name') name: string,
   @BodyProp('participants') participants: string[]): Promise<BasicResponse> {
    if (name) {
      return await createTeam({
        name,
        leader: leaderId,
        participants,
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
  @SuccessResponse(200)
  @Response<TeamResponse>(400, 'Something went wrong', errorExample)
  @Example<TeamResponse>({
    status: 200,
    message: 'Participant added successfully'
  })
  async updateTeam (@Inject() loggedUserId: string,
    @BodyProp('teamId') teamId: string,
    @BodyProp('updateOperation') updateOperation: updateTeamOperations,
    @BodyProp('data') data?: any): Promise<BasicResponse> {
    return await updateTeamById(loggedUserId, teamId, updateOperation, data);
  }

  /**
   * Endpoint to delete a Team
   * @param {string} loggedUserId Logged User ID
   * @param {string} teamId Team ID to delete
   * @returns {BasicResponse} Object with response status and confirmation or error message
   */
  @Delete('/')
  @SuccessResponse(200)
  @Response<TeamResponse>(400, 'Something went wrong', errorExample)
  @Example<TeamResponse>({
    status: 200,
    message: 'Team with ID {teamId} deleted successfully'
  })
  async deleteTeam (@Inject() loggedUserId: string, @BodyProp('teamId') teamId: string): Promise<BasicResponse> {
    return await deleteTeamById(loggedUserId, teamId);
  }
}
