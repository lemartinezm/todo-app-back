import { BasicResponse, LoginResponse } from '../../utils/ResponsesTypes';

export interface IAuthController {
  registerNewUser(username: string, email: string, password: string): Promise<BasicResponse>;
  loginUser(password: string, username?: string, email?: string): Promise<LoginResponse>
}
