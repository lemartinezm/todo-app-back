import { CreateTeamSchema } from '../models/interfaces/team.interface';
import { teamEntity } from '../models/schemas/team';
import { updateTeamOperations } from '../utils/Enums';
import { LogError } from '../utils/Logger';
import { BasicResponse } from '../utils/ResponsesTypes';

/**
 * Method to create a Team
 * @param {CreateTeamSchema} team Team to create
 * @returns {BasicResponse} Object with response status and confirmation or error message
 */
export const createTeam = async (team: CreateTeamSchema): Promise<BasicResponse> => {
  const response: BasicResponse = {
    status: 400,
    message: 'Something went wrong'
  };

  try {
    const teamModel = teamEntity();
    await teamModel.create(team)
      .then(teamCreated => {
        response.status = 201;
        response.message = 'Team created successfully';
      });
  } catch (error) {
    response.message = 'Failure creating team';
    LogError(`[ODM ERROR] ${error}`);
  }

  return response;
};

/**
 * Method to update a Team by ID
 * @param {string} loggedUserId Logged User ID
 * @param {string} teamId Team ID to update
 * @param {updateTeamOperations} updateOperation Type of update
 * @param {any} data Data to update
 * @returns {BasicResponse} Object with response status and confirmation or error message
 */
export const updateTeamById = async (loggedUserId: string,
  teamId: string,
  updateOperation: updateTeamOperations,
  data?: any): Promise<BasicResponse> => {
  const response: BasicResponse = {
    status: 400,
    message: 'Something went wrong'
  };

  try {
    const teamModel = teamEntity();

    await teamModel.findById(teamId)
      .then(teamFound => {
        if (teamFound.leader.toString() !== loggedUserId) {
          throw new Error('You can\'t modify the team because you\'re not the team leader');
        };
      });

    switch (updateOperation) {
      // It can be added multiple participants if data is an array of IDs
      case updateTeamOperations.ADD_MEMBER:
        await teamModel.findByIdAndUpdate(teamId, {
          $push: { participants: data }
        }).then(() => {
          response.status = 200;
          response.message = 'Participant added successfully';
        });
        break;

      case updateTeamOperations.ADD_TODO:
        await teamModel.findByIdAndUpdate(teamId, {
          $push: { todos: data }
        }).then(() => {
          response.status = 200;
          response.message = 'ToDo added successfully';
        });
        break;

      case updateTeamOperations.CHANGE_LEADER:
        await teamModel.findByIdAndUpdate(teamId, { leader: data }).then(() => {
          response.status = 200;
          response.message = 'Leader changed successfully';
        });
        break;
      default:
        break;
    }
  } catch (error) {
    response.message = `Failure updating team. ${error}`;
    LogError(`[ODM ERROR] ${error}`);
  }
  return response;
};
