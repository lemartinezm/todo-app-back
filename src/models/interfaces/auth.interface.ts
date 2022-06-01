/**
 * Register User Interface
 */
export interface RegisterUserSchema {
  username: string,
  email: string,
  password: string,
  todos: string[]
};

/**
 * Login User Interface
 */
export interface LoginUserSchema {
  username?: string,
  email?: string,
  password: string,
};
