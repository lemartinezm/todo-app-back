import { TodosResponse } from '../../utils/ResponsesTypes';

export interface ITodoController {
  getTodos(id?: string): Promise<TodosResponse>;

  getMyTodos(id: string): Promise<TodosResponse>;

  createNewTodo(
    name: string | undefined,
    description: string | undefined,
    deadline: Date | undefined,
    priority: string | undefined,
    loggedUserId: string,
    teamId?: string
  ): Promise<TodosResponse>;

  updateTodoById(
    id: string | undefined,
    name?: string,
    description?: string,
    deadline?: Date,
    priority?: string,
    completed?: boolean
  ): Promise<TodosResponse>;

  deleteTodoById(id: string | undefined): Promise<TodosResponse>
}
