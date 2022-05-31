import { TodosResponse } from '../../utils/ResponsesTypes';

export interface ITodoController {
  getTodos(id?: string): Promise<TodosResponse>;
  createNewTodo(name: string | undefined, priority: string | undefined): Promise<TodosResponse>;
  updateTodoById(id: string | undefined,
    name?: string | undefined,
    priority?: string | undefined,
    completed?: boolean | undefined): Promise<TodosResponse>;
  deleteTodoById(id: string | undefined): Promise<TodosResponse>
}
