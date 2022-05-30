export type BasicResponse = {
  status: number,
  message: string
}

// TODO: change the type of Todos (is not a string, is an object with properties) for return TodoObject
export type TodosResponse = {
  status: number,
  todos?: string[],
  message?: string
}
