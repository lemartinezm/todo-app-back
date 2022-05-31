import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server/index';
import { CreateTodoSchema } from '../src/models/interfaces/todo.interface';
import { todoEntity } from '../src/models/schemas/todo';

// Data for tests
const todosTest: CreateTodoSchema[] = [
  {
    name: 'First ToDo',
    priority: 'NORMAL',
    completed: false
  },
  {
    name: 'Second ToDo',
    priority: 'URGENT',
    completed: false
  }
];

// Server for tests
const server = request(app);

beforeEach(async () => {
  const todoModel = todoEntity();
  await todoModel.deleteMany({});
  await todoModel.create(todosTest);
});

describe('ToDos Tests', () => {
  test('[/api/todos] Get All ToDos', async () => {
    await server
      .get('/api/todos')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(todosTest.length);
      });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
