import { UsersResponse } from '../../utils/ResponsesTypes';

export interface IUserController {
  getUsers(id?: string): Promise<UsersResponse>;
  createNewUser(username: string | undefined,
    email: string | undefined,
    password: string | undefined): Promise<UsersResponse>;
  updateUser(id: string, username?: string, email?: string, password?: string): Promise<UsersResponse>;
  deleteUser(id: string | undefined): Promise<UsersResponse>;
}
