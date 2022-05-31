/**
 * Schema for create a ToDo
 */
export interface CreateTodoSchema {
  name: string,
  priority: string,
  completed: boolean
}

/**
 * Schema returned by DB
 */
export interface TodoSchemaDocs {
  _id: string,
  name: string,
  priority: string,
  completed: boolean,
  __v: number
}

export interface IUpdatedTodo {
  name?: string,
  priority?: string,
  completed?: boolean
}
