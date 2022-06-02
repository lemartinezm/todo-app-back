import { UsersResponse } from '../../utils/ResponsesTypes';

export interface IUserController {
  getUsers(id?: string): Promise<UsersResponse>;
  updateUser(id: string, username?: string, email?: string, password?: string): Promise<UsersResponse>;
  deleteUser(id: string | undefined): Promise<UsersResponse>;
}
