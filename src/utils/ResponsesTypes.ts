import { CreateTodoSchema, TodoSchemaDocs } from '../models/interfaces/todo.interface';

export type BasicResponse = {
  status: number,
  message: string
}

/**
 * Response for petitions sent to ToDos endpoints
 */
export type TodosResponse = {
  status: number,
  todos?: CreateTodoSchema[],
  message?: string
}

export type TodosResponseDocs = {
  status: number,
  todos?: TodoSchemaDocs[],
  message?: string
}
