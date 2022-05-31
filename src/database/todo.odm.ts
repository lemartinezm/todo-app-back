import { todoEntity } from '../models/schemas/todo';
import { TodosResponse } from '../utils/ResponsesTypes';
import { CreateTodoSchema, IUpdatedTodo } from '../models/interfaces/todo.interface';
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
 * Method to get ToDo by ID
 * @param {string} id ToDo ID to obtain
 * @returns {TodosResponse} Object with response status and todo or error message.
 */
export const getTodoById = async (id: string): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 400
  };
  try {
    const todoModel = todoEntity();
    await todoModel.findById(id)
      .then(todo => {
        if (todo) {
          response.status = 200;
          response.todos = [todo];
        } else {
          response.status = 404;
          throw new Error(`ToDo with id ${id} not found`);
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to create a ToDo in DB
 * @param {CreateTodoSchema} todo ToDo object to create in DB
 * @returns {TodosResponse} Object with status response and confirmation or error message
 */
export const createTodo = async (todo: CreateTodoSchema): Promise<TodosResponse> => {
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

/**
 * Method to update ToDo
 * @param {string} id ToDo ID to update
 * @param {CreateTodoSchema} todoUpdated ToDo with data updated
 * @returns {TodosResponse} Object with status response and confirmation or error message
 */
export const updateTodo = async (id: string, todoUpdated: IUpdatedTodo): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 400
  };
  try {
    const todoModel = todoEntity();
    await todoModel.findByIdAndUpdate(id, todoUpdated)
      .then((res) => {
        if (res) {
          response.status = 200;
          response.message = `ToDo with id ${id} updated successfully`;
        } else {
          response.status = 404;
          throw new Error(`Todo with ID ${id} not found`);
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};

/**
 * Method to delete ToDo by ID
 * @param {string} id ToDo ID to delete
 * @returns {TodosResponse} Object with status response and confirmation or error message
 */
export const deleteTodo = async (id: string): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 400
  };

  try {
    const todoModel = todoEntity();
    await todoModel.findByIdAndDelete(id)
      .then((res) => {
        if (res) {
          response.status = 200;
          response.message = `ToDo with id ${id} deleted successfully`;
        } else {
          response.status = 404;
          throw new Error(`ToDo with id ${id} not found`);
        }
      });
  } catch (error) {
    response.message = `${error}`;
    LogError(`[ODM ERROR] Something went wrong. Details ${error}`);
  }

  return response;
};
