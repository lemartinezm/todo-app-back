import { TodoSchema } from '../models/interfaces/todo.interface';
import { UserSchema } from '../models/interfaces/user.interface';

/**
 * Basic Response containing response status and confirmation or error message
 */
export type BasicResponse = {
  status: number,
  message: string
}

/**
 * Response for petitions sent to ToDos endpoints
 */
export type TodosResponse = {
  status: number,
  todos?: TodoSchema[],
  message?: string
}

/**
 * Response for petitions sent to Users endpoints
 */
export type UsersResponse = {
  status: number,
  users?: UserSchema[],
  message?: string
};

/**
 * Login response including JWT generated
 */
export type LoginResponse = {
  status: number,
  message: string,
  token?: string
};
