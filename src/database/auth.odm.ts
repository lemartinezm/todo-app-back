import { LoginUserSchema, RegisterUserSchema } from '../models/interfaces/auth.interface';
import { userEntity } from '../models/schemas/user';
import { LogError } from '../utils/Logger';
import { BasicResponse, LoginResponse } from '../utils/ResponsesTypes';
import bcrypt from 'bcrypt';
import { UserSchema } from '../models/interfaces/user.interface';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

/**
 * Method to register User
 * @param {RegisterUserSchema} newUser New User to register
 * @returns {BasicResponse} Object with response status and confirmation or error message
 */
export const registerUser = async (newUser: RegisterUserSchema): Promise<BasicResponse> => {
  const response: BasicResponse = {
    status: 400,
    message: 'Something went wrong'
  };

  try {
    const userModel = userEntity();
    await userModel.create(newUser)
      .then(() => {
        response.status = 201;
        response.message = 'User registered successfully';
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to login with username
 * @param {LoginUserSchema} user User data (username and password)
 * @returns {LoginResponse} Object with response status, confirmation or error message and JWT for successful login
 */
export const loginUserWithUsername = async (user: LoginUserSchema): Promise<LoginResponse> => {
  const response: LoginResponse = {
    status: 400,
    message: 'Something went wrong'
  };

  try {
    const userModel = userEntity();
    await userModel.findOne({ username: user.username })
      .then((userFound: UserSchema | null) => {
        if (userFound) {
          // Verify password
          const validPassword: boolean = bcrypt.compareSync(user.password, userFound.password);
          if (!validPassword) throw new Error('Invalid password');

          // Login successful
          response.status = 200;
          response.message = `Welcome ${userFound.username}`;
          // Create JWT
          response.token = jwt.sign(
            { id: userFound._id },
            SECRET_KEY!,
            { expiresIn: '3h' }
          );
        } else {
          response.status = 404;
          throw new Error('Login failed');
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to login with email
 * @param {LoginUserSchema} user User data (email and password)
 * @returns {LoginResponse} Object with response status, confirmation or error message and JWT for successful login
 */
export const loginUserWithEmail = async (user: LoginUserSchema): Promise<LoginResponse> => {
  const response: LoginResponse = {
    status: 400,
    message: 'Something went wrong'
  };

  try {
    const userModel = userEntity();
    await userModel.findOne({ email: user.email })
      .then((userFound: UserSchema | null) => {
        if (userFound) {
          // Verify password
          const validPassword: boolean = bcrypt.compareSync(user.password, userFound.password);
          if (!validPassword) throw new Error('Invalid password');

          // Login successful
          response.status = 200;
          response.message = `Welcome ${userFound.email}`;
          // Create JWT
          response.token = jwt.sign(
            { id: userFound._id },
            SECRET_KEY!,
            { expiresIn: '3h' }
          );
        } else {
          response.status = 404;
          throw new Error('Login failed');
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};
