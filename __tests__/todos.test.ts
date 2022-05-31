import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server/index';
import { CreateTodoSchema } from '../src/models/interfaces/todo.interface';
import { todoEntity } from '../src/models/schemas/todo';

// Data for tests
const todosForTest: CreateTodoSchema[] = [
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
let firstTodoId: string;
const newTodo: any = {
  name: 'New ToDo for POST request',
  priority: 'LOW'
};
const wrongTodo: any = {
  name: 'New ToDo for POST request'
};

// Server for tests
const server = request(app);

beforeEach(async () => {
  const todoModel = todoEntity();
  await todoModel.deleteMany({});
  await todoModel.create(todosForTest).then(todosReturned => { firstTodoId = todosReturned[0]._id.toString(); });
});

describe('ToDos Tests', () => {
  test('[/api/todos] Get All ToDos', async () => {
    await server
      .get('/api/todos')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(todosForTest.length);
      });
  });
  test('[/api/todos?id={todoId}] Get ToDo by ID', async () => {
    await server
      .get(`/api/todos?id=${firstTodoId}`)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(1);
      });
  });
  test('[/api/todos] Success creating ToDo', async () => {
    await server
      .post('/api/todos')
      .send(newTodo)
      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('ToDo created successfully');
      });
  });
  test('[/api/todos] Failure creating ToDo', async () => {
    await server
      .post('/api/todos')
      .send(wrongTodo)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Please, complete all fields');
      });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
