export interface UserSchema {
  _id: string,
  username: string,
  email: string,
  password: string,
  todos: string[],
  __v: number
};

export interface CreateUserSchema {
  username: string,
  email: string,
  password: string,
  todos: string[]
};

export interface UpdateUserSchema {
  username?: string,
  email?: string,
  password?: string
};

/**
 * Interface used for get requests
 */
export interface GetUserSchema {
  _id: string,
  username: string,
  email: string,
  todos: string[],
  __v: number
};
