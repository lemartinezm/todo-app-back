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
