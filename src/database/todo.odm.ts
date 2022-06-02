import { todoEntity } from '../models/schemas/todo';
import { TodosResponse } from '../utils/ResponsesTypes';
import { CreateTodoSchema, UpdateTodoSchema } from '../models/interfaces/todo.interface';
import { LogError } from '../utils/Logger';
import { updateTeamById } from './team.odm';
import { updateTeamOperations } from '../utils/Enums';

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
 * Method to get ToDos by creator ID
 * @param {string} userId User'd ID to obtain ToDos
 * @returns {TodosResponse} Object with response status and ToDos or error message.
 */
export const getTodosByCreatorId = async (userId: string): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 400
  };
  try {
    const todoModel = todoEntity();
    await todoModel.find({ creator: userId })
      .then(todos => {
        if (todos) {
          response.status = 200;
          response.todos = todos;
        } else {
          response.status = 400;
          throw new Error('Something went wrong');
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
export const createTodo = async (todo: CreateTodoSchema, teamId?: string): Promise<TodosResponse> => {
  const response: TodosResponse = {
    status: 400,
    message: ''
  };

  try {
    const todoModel = todoEntity();
    await todoModel.create(todo)
      .then(async (todoCreated) => {
        response.status = 201;
        response.message = 'ToDo created successfully';

        // Add to team if there is teamId
        if (teamId) {
          await updateTeamById(todo.creator, teamId, updateTeamOperations.ADD_TODO, todoCreated._id.toString())
            .then((updateResponse) => {
              if (updateResponse.status !== 200) {
                throw new Error('Can\'t be added to the team');
              }
              response.message = response.message?.concat('. ', `ToDo added to team ${teamId}`);
            });
        }
      });
  } catch (error) {
    response.message = response.message?.concat('. ', `${error}`);
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
export const updateTodo = async (id: string, todoUpdated: UpdateTodoSchema): Promise<TodosResponse> => {
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
