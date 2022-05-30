import { todoEntity } from '../models/schemas/todo';
import { TodosResponse } from '../utils/ResponsesTypes';
import { ITodo } from '../models/interfaces/todo.interface';
import { LogError } from '../utils/Logger';

/**
 * Method to Get All ToDos
 * @returns {TodosResponse} Object with response status and todos or error message.
 */
export const getAllTodos = async (): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 0
  };

  try {
    const todoModel = todoEntity();
    await todoModel.find()
      .then(todos => {
        response.status = 200;
        response.todos = todos;
      });
  } catch (error) {
    response.status = 400;
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to create a ToDo in DB
 * @param {ITodo} todo ToDo object to create in DB
 * @returns {TodosResponse} Object with status response and confirmation or error message
 */
export const createTodo = async (todo: ITodo): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 0
  };

  try {
    const todoModel = todoEntity();
    await todoModel.create(todo)
      .then(() => {
        response.status = 201;
        response.message = 'ToDo created successfully';
      });
  } catch (error) {
    response.status = 400;
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};
