import { createTodo, getAllTodos } from '../database/todo.odm';
import { TodosResponse } from '../utils/ResponsesTypes';
import { ITodoController } from './interfaces/todoController.interface';
import { Get, Route, Tags } from 'tsoa';

@Route('api/todos')
@Tags('TodoController')
export class TodoController implements ITodoController {
  /**
   * Method to get all todos from DB (to implement...)
   * @returns Todos from test variables
   */
  @Get('/')
  async getTodos (): Promise<TodosResponse> {
    const response: TodosResponse = await getAllTodos();
    return response;
  };

  /**
   * Method to create a ToDo
   * @param {string} name ToDo name
   * @returns {TodosResponse} Object with status code and confirmation or error message.
   */
  async createNewTodo (name: string | undefined, priority: string | undefined): Promise<TodosResponse> {
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
    }

    return response;
  }
}
