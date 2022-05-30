import { TodosResponse } from '../../utils/ResponsesTypes';

export interface ITodoController {
  getTodos(): Promise<TodosResponse>,
  createNewTodo(name: string | undefined, priority: string | undefined): Promise<TodosResponse>
}
