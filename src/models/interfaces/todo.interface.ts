/**
 * Schema for create a ToDo
 */
export interface CreateTodoSchema {
  name: string,
  description?: string,
  createdAt: Date,
  deadline?: Date,
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
  description?: string,
  createdAt: Date,
  deadline?: Date,
  priority: string,
  completed: boolean,
  creator: string
  __v: number
}

export interface UpdateTodoSchema {
  name?: string,
  description?: string,
  deadline?: Date,
  priority?: string,
  completed?: boolean
}
