import { CreateUserSchema, UpdateUserSchema } from '../models/interfaces/user.interface';
import { userEntity } from '../models/schemas/user';
import { LogError } from '../utils/Logger';
import { UsersResponse } from '../utils/ResponsesTypes';

/**
 * Method to get all users
 * @returns {UsersResponse} Object with response status and users array or error message
 */
export const getAllUsers = async (): Promise<UsersResponse> => {
  const response: UsersResponse = {
    status: 400
  };

  try {
    const userModel = userEntity();
    await userModel.find({})
      .then(users => {
        response.status = 200;
        response.users = users;
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to get user by ID
 * @param {string} id User ID to obtain
 * @returns {UsersResponse} Object with response status and users array or error message
 */
export const getUserById = async (id: string): Promise<UsersResponse> => {
  const response: UsersResponse = {
    status: 400
  };

  try {
    const userModel = userEntity();
    await userModel.findById(id)
      .then(user => {
        if (user) {
          response.status = 200;
          response.users = [user];
        } else {
          response.status = 404;
          throw new Error(`User with id ${id} not found`);
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to create a User
 * @param {CreateUserSchema} user User to create
 * @returns {UsersResponse} Object with response status and confirmation or error message
 */
export const createUser = async (user: CreateUserSchema): Promise<UsersResponse> => {
  const response: UsersResponse = {
    status: 400
  };

  try {
    const userModel = userEntity();
    await userModel.create(user)
      .then(() => {
        response.status = 200;
        response.message = 'User created successfully';
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to update an User
 * @param {string} id User ID to update
 * @param {UpdateUserSchema} userUpdated User with data updated
 * @returns {UsersResponse} Object with response status and confirmation or error message
 */
export const updateUserById = async (id: string, userUpdated: UpdateUserSchema): Promise<UsersResponse> => {
  const response: UsersResponse = {
    status: 400
  };

  try {
    const userModel = userEntity();
    await userModel.findByIdAndUpdate(id, userUpdated)
      .then(userFound => {
        if (userFound) {
          response.status = 200;
          response.message = 'User updated successfully';
        } else {
          response.status = 404;
          throw new Error(`User with id ${id} not found`);
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to delete user by ID
 * @param {string} id User ID to delete
 * @returns {UsersResponse} Object with response status and confirmation or error message
 */
export const deleteUserById = async (id: string): Promise<UsersResponse> => {
  const response: UsersResponse = {
    status: 400
  };

  try {
    const userModel = userEntity();
    await userModel.findByIdAndDelete(id)
      .then(userFound => {
        if (userFound) {
          response.status = 200;
          response.message = 'User deleted successfully';
        } else {
          response.status = 400;
          throw new Error(`User with id ${id} not found`);
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};
