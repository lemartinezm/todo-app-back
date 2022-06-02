import { createTodo, deleteTodo, getAllTodos, getTodosByCreatorId, getTodoById, updateTodo } from '../database/todo.odm';
import { TodosResponse } from '../utils/ResponsesTypes';
import { ITodoController } from './interfaces/todoController.interface';
import { BodyProp, Delete, Example, Get, Inject, Post, Put, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { LogError } from '../utils/Logger';
import { UpdateTodoSchema } from '../models/interfaces/todo.interface';

// Example object for error petitions
const errorExample: TodosResponse = {
  status: 400,
  message: 'Error: Something went wrong'
};

@Route('api/todos')
@Tags('TodoController')
export class TodoController implements ITodoController {
  /**
   * Endpoint to get all ToDos or one by ID
   * @param {string} id ToDo ID to obtain
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Get('/')
  @SuccessResponse(200, 'ToDos obtained successfully')
  @Response<TodosResponse>(400, 'Something went wrong', errorExample)
  @Example<TodosResponse>({
    status: 200,
    todos: [
      {
        _id: '6294dd86ecca76f24a89503d',
        name: 'This is a ToDo example',
        priority: 'NORMAL',
        completed: false,
        creator: '{creatorId}',
        __v: 0
      },
      {
        _id: '6294ddfed8d225386a4f956c',
        name: 'Second ToDo example',
        priority: 'HIGH',
        completed: false,
        creator: '{creatorId}',
        __v: 0
      }
    ]
  })
  async getTodos (@Query() id?: string): Promise<TodosResponse> {
    let response: TodosResponse;
    if (id) {
      response = await getTodoById(id);
    } else {
      response = await getAllTodos();
    }
    return response;
  };

  /**
   * Endpoint to Todos of User
   * @param {string} userId User's ID
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Get('/me')
  async getMyTodos (@Inject() userId: string): Promise<TodosResponse> {
    return await getTodosByCreatorId(userId);
  }

  /**
   * Endpoint to create a ToDo
   * @param {string} name ToDo name
   * @param {string} priority ToDo priority
   * @param {string} loggedUserId Logged User ID
   * @param {string} teamId Team ID to add todo
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Post('/')
  @SuccessResponse(201, 'ToDos created successfully')
  @Response<TodosResponse>(400, 'Something went wrong', errorExample)
  @Example({
    status: 201,
    message: 'ToDo created successfully'
  })
  async createNewTodo (
    @BodyProp('name') name: string | undefined,
    @BodyProp('priority') priority: string | undefined,
    @Inject() loggedUserId: string,
    @BodyProp('teamId') teamId?: string
  ): Promise<TodosResponse> {
    let response: TodosResponse;
    if (name && priority) {
      response = await createTodo({
        name,
        priority,
        completed: false,
        creator: loggedUserId
      }, teamId);
    } else {
      response = {
        status: 400,
        message: 'Please, complete all fields'
      };
      LogError(`[api/todo] ${response.message}`);
    }

    return response;
  }

  /**
   * Endpoint to update ToDo by ID
   * @param {string} id ToDo ID to update
   * @param {string} name New name to update ToDo
   * @param {string} priority New priority to update ToDo
   * @param {boolean} completed New completed to update ToDo
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Put('/')
  @SuccessResponse(200, 'ToDo updated successfully')
  @Response<TodosResponse>(400, 'Something went wrong', errorExample)
  @Example<TodosResponse>({
    status: 200,
    message: 'ToDo with id {ToDo ID} updated successfully'
  })
  async updateTodoById (
    @Query() id: string,
    @BodyProp('name') name?: string,
    @BodyProp('priority') priority?: string,
    @BodyProp('completed') completed?: boolean
  ): Promise<TodosResponse> {
    let response: TodosResponse;

    if (id) {
      const todoUpdated: UpdateTodoSchema = {};
      if (name) todoUpdated.name = name;
      if (priority) todoUpdated.priority = priority;
      if (completed !== undefined) todoUpdated.completed = completed;
      response = await updateTodo(id, todoUpdated);
    } else {
      response = {
        status: 400,
        message: 'Missing ToDo ID to update'
      };
      LogError(`[api/todo] ${response.message}`);
    }

    return response;
  }

  /**
   * Endpoint to delete a ToDo by ID
   * @param {string} id ToDo ID to delete
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Delete('/')
  @SuccessResponse(200, 'ToDo deleted successfully')
  @Response<TodosResponse>(400, 'Something went wrong', errorExample)
  @Example<TodosResponse>({
    status: 200,
    message: 'ToDo with id {ToDo ID} deleted successfully'
  })
  async deleteTodoById (@Query() id: string): Promise<TodosResponse> {
    let response: TodosResponse;
    if (id) {
      response = await deleteTodo(id);
    } else {
      response = {
        status: 400,
        message: 'Missing ToDo ID to delete'
      };
      LogError(`[api/todo] ${response.message}`);
    }

    return response;
  }
}
