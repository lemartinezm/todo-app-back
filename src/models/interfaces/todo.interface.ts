/**
 * Schema of all ToDos
 */
export interface TodoSchema {
  name: string,
  priority: string,
  completed: boolean
}

export interface IUpdatedTodo {
  name?: string,
  priority?: string,
  completed?: boolean
}
