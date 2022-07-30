import { CreateTeamSchema, TeamSchema } from '../models/interfaces/team.interface';
import { teamEntity } from '../models/schemas/team';
import { todoEntity } from '../models/schemas/todo';
import { userEntity } from '../models/schemas/user';
import { LogError } from '../utils/Logger';
import { BasicResponse, TeamResponse } from '../utils/ResponsesTypes';

/**
 * Method to get Teams by participant ID
 * @param {string} loggedUserId Logged User ID
 * @returns {TeamResponse} Object with response status
 */
export const getTeamsByParticipantId = async (loggedUserId: string, documentsPerPage: number, currentPage: number): Promise<TeamResponse> => {
  const response: TeamResponse = {
    status: 400
  };

  try {
    const teamModel = teamEntity();
    await teamModel.find({ participants: loggedUserId })
      .then(async (teams: TeamSchema[]) => {
        response.status = 200;
        if (teams.length > 0) {
          const todoModel = todoEntity();
          const userModel = userEntity();
          response.teams = await Promise.all(
            teams.map(async (team: TeamSchema) => {
              const totalDocuments = await todoModel.find({ _id: { $in: team.todos } }).countDocuments();
              return {
                _id: team._id,
                name: team.name,
                leader: await userModel.findById(team.leader, { _id: 1, username: 1, email: 1 }),
                participants: await userModel.find({ _id: { $in: team.participants } }, { _id: 1, username: 1, email: 1 }),
                todos: await todoModel.find({ _id: { $in: team.todos } })
                  .skip(documentsPerPage * (currentPage - 1))
                  .limit(documentsPerPage),
                meta: {
                  totalPages: Math.ceil(totalDocuments / documentsPerPage),
                  currentPage,
                  documentsPerPage,
                  totalDocuments
                },
                __v: team.__v
              };
            })
          );
        } else {
          response.message = 'You don\'t participate in any team';
        }
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
    const userModel = userEntity();
    await userModel.find({ username: { $in: team.participants } })
      .then(async (usersFound) => {
        team.participants = [team.leader, ...usersFound.map(user => user._id)];
        await teamModel.create(team)
          .then(() => {
            response.status = 201;
            response.message = 'Team created successfully';
          });
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
 * @param {string} updatedTeam Updated Team
 * @returns {BasicResponse} Object with response status and confirmation or error message
 */
export const updateTeamById = async (loggedUserId: string,
  updatedTeam: any): Promise<BasicResponse> => {
  const response: BasicResponse = {
    status: 400,
    message: 'Something went wrong'
  };

  try {
    const teamModel = teamEntity();

    await teamModel.findById(updatedTeam._id)
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

    const userModel = userEntity();

    await userModel.find({ username: { $in: updatedTeam.participants } })
      .then(async (usersFound) => {
        updatedTeam.participants = usersFound.map(user => user._id);
        await teamModel.findByIdAndUpdate(updatedTeam._id, updatedTeam)
          .then(() => {
            response.status = 200;
            response.message = 'Team updated successfully';
          });
      });
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
