import { CreateTeamSchema, TeamSchema } from '../models/interfaces/team.interface';
import { teamEntity } from '../models/schemas/team';
import { todoEntity } from '../models/schemas/todo';
import { userEntity } from '../models/schemas/user';
import { updateTeamOperations } from '../utils/Enums';
import { LogError } from '../utils/Logger';
import { BasicResponse, TeamResponse } from '../utils/ResponsesTypes';

/**
 * Method to get Teams by participant ID
 * @param {string} loggedUserId Logged User ID
 * @returns {TeamResponse} Object with response status
 */
export const getTeamsByParticipantId = async (loggedUserId: string): Promise<TeamResponse> => {
  const response: TeamResponse = {
    status: 400
  };

  try {
    const teamModel = teamEntity();
    await teamModel.find({ participants: loggedUserId })
      .then(async (teams: TeamSchema[]) => {
        if (teams.length > 0) {
          response.status = 200;
          const todoModel = todoEntity();
          const userModel = userEntity();
          response.teams = await Promise.all(
            teams.map(async (team: TeamSchema) => {
              return {
                _id: team._id,
                name: team.name,
                leader: await userModel.findById(team.leader, { _id: 1, username: 1, email: 1 }),
                participants: await userModel.find({ _id: { $in: team.participants } }, { _id: 1, username: 1, email: 1 }),
                todos: await todoModel.find({ _id: { $in: team.todos } }),
                __v: team.__v
              };
            })
          );
        } else {
          throw new Error('You don\'t participate in any team');
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] ${error}`);
  }

  return response;
};

export const getTeamById = async (teamId: string) => {
  const response: TeamResponse = {
    status: 400
  };

  try {
    const teamModel = teamEntity();
    await teamModel.findById(teamId)
      .then((team: TeamSchema) => {
        response.teams = [team];
        response.status = 200;
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] ${error}`);
  }

  return response;
};

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
        if (teamFound) {
          if (teamFound.leader.toString() !== loggedUserId) {
            throw new Error('You can\'t modify the team because you\'re not the team leader');
          };
        } else {
          response.status = 404;
          throw new Error('Team not found');
        }
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

/**
 * Method to delete team by ID
 * @param {string} loggedUserId Logged User ID
 * @param {string} teamId Team ID to delete
 * @returns {BasicResponse} Object with response status and confirmation or error message
 */
export const deleteTeamById = async (loggedUserId: string, teamId: string): Promise<BasicResponse> => {
  const response: BasicResponse = {
    status: 400,
    message: ''
  };

  try {
    const teamModel = teamEntity();
    await teamModel.findById(teamId)
      .then(async (teamFound) => {
        if (teamFound.leader.toString() !== loggedUserId) {
          throw new Error('You are not the leader to delete this team');
        }
        await teamModel.findByIdAndDelete(teamId)
          .then(() => {
            response.status = 200;
            response.message = `Team with ID ${teamId} deleted successfully`;
          });
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] ${error}`);
  }

  return response;
};
