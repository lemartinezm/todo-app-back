import { TodoSchema } from '../models/interfaces/todo.interface';
import { GetUserSchema } from '../models/interfaces/user.interface';

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
  message?: string,
  /**
   * Pagination info
   */
  meta?: {
    totalPages: number,
    currentPage: number,
    documentsPerPage: number,
    totalDocuments: number
  }
}

/**
 * Response for petitions sent to Users endpoints
 */
export type UsersResponse = {
  status: number,
  users?: GetUserSchema[],
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

/**
 * Response for petitions sent to Teams endpoints
 */
export type TeamResponse = {
  status: number,
  message?: string,
  teams?: any[]
};
