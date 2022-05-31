import { createTodo, getAllTodos, updateTodo } from '../database/todo.odm';
import { BasicResponse, TodosResponse } from '../utils/ResponsesTypes';
import { ITodoController } from './interfaces/todoController.interface';
import { BodyProp, Get, Post, Put, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { LogError } from '../utils/Logger';
import { IUpdatedTodo } from '../models/interfaces/todo.interface';

@Route('api/todos')
@Tags('TodoController')
export class TodoController implements ITodoController {
  /**
   * Endpoint to get all ToDos
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Get('/')
  @SuccessResponse(200, 'ToDos obtained successfully')
  @Response(400, 'Something went wrong')
  async getTodos (): Promise<TodosResponse> {
    const response: TodosResponse = await getAllTodos();
    return response;
  };

  /**
   * Endpoint to create a ToDo
   * @param {string} name ToDo name
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  @Post('/')
  @SuccessResponse(201, 'ToDos created successfully')
  @Response(400, 'Something went wrong')
  async createNewTodo (@BodyProp('name') name: string | undefined,
  @BodyProp('priority') priority: string | undefined): Promise<TodosResponse> {
    let response: TodosResponse;
    if (name && priority) {
      response = await createTodo({
        name,
        priority,
        completed: false
      });
    } else {
      response = {
        status: 400,
        message: 'Please, complete all the fields'
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
   * @returns {TodosResponse || BasicResponse} Object with status code and confirmation or error message.
   */
  @Put('/')
  @SuccessResponse(200, 'ToDo updated successfully')
  @Response<BasicResponse>(400, 'Something went wrong', {
    status: 400,
    message: 'Something went wrong'
  })
  async updateTodoById (@Query() id: string,
    @BodyProp('name') name?: string,
    @BodyProp('priority') priority?: string,
    @BodyProp('completed') completed?: boolean): Promise<TodosResponse> {
    let response: TodosResponse;

    if (id) {
      const todoUpdated: IUpdatedTodo = {};
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
}
