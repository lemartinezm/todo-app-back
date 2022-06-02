import { loginUserWithEmail, loginUserWithUsername, registerUser } from '../database/auth.odm';
import { BasicResponse, LoginResponse } from '../utils/ResponsesTypes';
import { IAuthController } from './interfaces/authController.interface';
import bcrypt from 'bcrypt';
import { LogError } from '../utils/Logger';
import { BodyProp, Example, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';

const errorExample: BasicResponse = {
  status: 400,
  message: 'Something went wrong'
};

@Route('api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {
  /**
   * Endpoint to register new User
   * @param {string} username User's username
   * @param {string} email User's email
   * @param {password} password User's password
   * @returns {BasicResponse} Object with response status and confirmation or error message
   */
  @Post('register')
  @SuccessResponse(201, 'User registered successfully')
  @Response<BasicResponse>(400, 'User registration failed', errorExample)
  @Example({
    status: 201,
    message: 'User registered successfully'
  })
  async registerNewUser (@BodyProp('username') username: string,
  @BodyProp('email') email: string,
  @BodyProp('password') password: string): Promise<BasicResponse> {
    let response: BasicResponse;
    if (username && email && password) {
      // Encrypt password
      const hashedPassword = bcrypt.hashSync(password, 8);
      response = await registerUser({
        username,
        email,
        password: hashedPassword,
        todos: []
      });
    } else {
      response = {
        status: 400,
        message: 'Please, complete all fields'
      };
      LogError(`[api/users] ${response.message}`);
    }

    return response;
  }

  /**
   * Endpoint to login User
   * @param {string} password User's password
   * @param {string} username User's username
   * @param {string} email User's email
   * @returns {LoginResponse} Object with response status, confirmation or error message and JWT for successful login
   */
  @Post('login')
  @SuccessResponse(200, 'User logged successfully')
  @Response<LoginResponse>(400, 'Logging failed', errorExample)
  @Example({
    status: 200,
    message: 'Welcome {username}',
    token: '{tokenObtained}'
  })
  async loginUser (@BodyProp('password') password: string,
  @BodyProp('username') username?: string,
  @BodyProp('email') email?: string): Promise<LoginResponse> {
    let response: LoginResponse;

    if (username || email) {
      if (username) {
        response = await loginUserWithUsername({
          username,
          password
        });
      } else {
        response = await loginUserWithEmail({
          email,
          password
        });
      }
    } else {
      response = {
        status: 400,
        message: 'Please, provide an email or username'
      };
      LogError(`[api/users] ${response.message}`);
    }

    return response;
  }
}
