import { Get, Query, Route, SuccessResponse, Tags, Response, Example, BodyProp, Put, Delete } from 'tsoa';
import { deleteUserById, getAllUsers, getUserById, updateUserById } from '../database/user.odm';
import { LogError } from '../utils/Logger';
import { UsersResponse } from '../utils/ResponsesTypes';
import { IUserController } from './interfaces/userController.interface';

const errorExample: UsersResponse = {
  status: 400,
  message: 'Something went wrong'
};

@Route('api/users')
@Tags('UserController')
export class UserController implements IUserController {
  /**
   * Endpoint to get all users or one by ID
   * @param {string} id User ID to obtain
   * @returns {UsersResponse} Object with response status and users array or error message
   */
  @Get('/')
  @SuccessResponse(200, 'Users obtained successfully')
  @Response<UsersResponse>(404, 'User not found', errorExample)
  @Example<UsersResponse>({
    status: 200,
    users: [
      {
        _id: '',
        username: '',
        email: '',
        password: '',
        todos: [],
        __v: 0
      },
      {
        _id: '',
        username: '',
        email: '',
        password: '',
        todos: [],
        __v: 0
      }
    ]
  })
  async getUsers (@Query() id?: string): Promise<UsersResponse> {
    let response: UsersResponse;
    if (id) {
      response = await getUserById(id);
    } else {
      response = await getAllUsers();
    }
    return response;
  }

  /**
   * Endpoint to update an User by ID
   * @param {string} id User ID to update
   * @param {string} username Updated username
   * @param {string} email Updated email
   * @param {string} password Updated password
   * @returns {UsersResponse} Object with response status and confirmation or error message
   */
  @Put('/')
  @SuccessResponse(200, 'User updated successfully')
  @Response<UsersResponse>(400, 'Something went wrong', errorExample)
  @Response<UsersResponse>(404, 'User not found to update', errorExample)
  @Example({
    status: 200,
    message: 'User updated successfully'
  })
  async updateUser (@Query() id: string,
    @BodyProp('username') username?: string,
    @BodyProp('email') email?: string,
    @BodyProp('password') password?: string): Promise<UsersResponse> {
    let response: UsersResponse;

    if (id) {
      const userUpdated: any = {};
      if (username) userUpdated.username = username;
      if (email) userUpdated.email = email;
      if (password) userUpdated.password = password;
      response = await updateUserById(id, userUpdated);
    } else {
      response = {
        status: 400,
        message: 'Missing User ID to update'
      };
      LogError(`[api/todo] ${response.message}`);
    }
    return response;
  }

  /**
   * Endpoint to delete User by ID
   * @param {string} id User ID to delete
   * @returns {UsersResponse} Object with response status and confirmation or error message
   */
  @Delete('/')
  @SuccessResponse(200, 'User deleted successfully')
  @Response<UsersResponse>(400, 'Something went wrong', errorExample)
  @Response<UsersResponse>(404, 'User not found to delete', errorExample)
  @Example({
    status: 200,
    message: 'User deleted successfully'
  })
  async deleteUser (@Query() id: string): Promise<UsersResponse> {
    let response: UsersResponse;

    if (id) {
      response = await deleteUserById(id);
    } else {
      response = {
        status: 400,
        message: 'Missing User ID to delete'
      };
      LogError(`[api/todo] ${response.message}`);
    }

    return response;
  }
};
