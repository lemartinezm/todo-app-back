/**
 * Schema for create a ToDo
 */
export interface CreateTodoSchema {
  name: string,
  priority: string,
  completed: boolean,
  creator: string
}

/**
 * Schema returned by DB
 */
export interface TodoSchema {
  _id: string,
  name: string,
  priority: string,
  completed: boolean,
  creator: string,
  __v: number
}

export interface UpdateTodoSchema {
  name?: string,
  priority?: string,
  completed?: boolean
}
