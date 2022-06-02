import { TodosResponse } from '../../utils/ResponsesTypes';

export interface ITodoController {
  getTodos(id?: string): Promise<TodosResponse>;

  getMyTodos(id: string): Promise<TodosResponse>;

  createNewTodo(
    name: string | undefined,
    priority: string | undefined,
    loggedUserId: string,
    teamId?: string
  ): Promise<TodosResponse>;

  updateTodoById(
    id: string | undefined,
    name?: string,
    priority?: string,
    completed?: boolean
  ): Promise<TodosResponse>;

  deleteTodoById(id: string | undefined): Promise<TodosResponse>
}
