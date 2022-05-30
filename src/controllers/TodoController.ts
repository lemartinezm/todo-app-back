import { ITodoController } from './interfaces/ITodoController';

// Test variables
const todos: string[] = [
  'First todo',
  'Second todo',
  'Third todo'
];

export class TodoController implements ITodoController {
  /**
   * Method to get all todos from DB (to implement...)
   * @returns Todos from test variables
   */
  async getAllTodos (): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          status: 200,
          todos
        });
      }, 3000);
    });
  }
}
