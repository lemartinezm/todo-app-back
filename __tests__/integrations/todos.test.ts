import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/server/index';
import { CreateTodoSchema } from '../../src/models/interfaces/todo.interface';
import { todoEntity } from '../../src/models/schemas/todo';
import { userEntity } from '../../src/models/schemas/user';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Data for tests
const usersForTest: any[] = [
  {
    username: 'jose123',
    email: 'jose@email.com',
    password: 'josePass'
  },
  {
    username: 'martin123',
    email: 'martin@email.com',
    password: 'martinPass'
  }
];
const usersTokens: any = [];

const todosForTest: CreateTodoSchema[] = [
  {
    name: 'First ToDo',
    priority: 'NORMAL',
    completed: false,
    creator: ''
  },
  {
    name: 'Second ToDo',
    priority: 'URGENT',
    completed: false,
    creator: ''
  }
];
let firstTodoId: string;
const wrongTodoId: string = '1a9a7f0584019a636a3';
const notFoundTodoId: string = '1a9a7fc7405840159af636a3';
const newTodo: any = {
  name: 'New ToDo for POST request',
  priority: 'LOW'
};
const incompleteTodo: any = {
  name: 'New ToDo for POST request'
};
const updatedTodo: any = {
  name: 'Updated ToDo',
  completed: true,
  priority: 'LOW'
};

// Server for tests
const server = request(app);

beforeAll(async () => {
  // Create users before tests
  const userModel = userEntity();
  await userModel.deleteMany();
  await userModel.create(usersForTest).then(users => {
    users.map((user: any, index: number) => {
      // Add the user ID of created users to ToDos creators
      todosForTest[index].creator = user._id.toString();
      // Save tokens
      usersTokens.push(jwt.sign(
        { id: user._id.toString() },
        SECRET_KEY!,
        { expiresIn: '3h' }
      ));
      return null;
    });
  });
});

beforeEach(async () => {
  const todoModel = todoEntity();
  await todoModel.deleteMany({});
  await todoModel.create(todosForTest).then(todosReturned => { firstTodoId = todosReturned[0]._id.toString(); });
});

describe('ToDos Tests', () => {
  // * Get Todos
  test('[/api/todos] Success getting All ToDos', async () => {
    await server
      .get('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(todosForTest.length);
      });
  });

  test('[/api/todos?id={todoId}] Success getting ToDo by ID', async () => {
    await server
      .get(`/api/todos?id=${firstTodoId}`)
      .set({ 'x-access-token': usersTokens[0] })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(1);
      });
  });

  test('[/api/todos?id={todoId}] Success getting my ToDos', async () => {
    await server
      .get('/api/todos/me')
      .set({ 'x-access-token': usersTokens[0] })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(1);
      });
  });

  test('[/api/todos?id={todoId}] Failure getting ToDo by ID (incomplete ToDo ID)', async () => {
    await server
      .get(`/api/todos?id=${wrongTodoId}`)
      .set({ 'x-access-token': usersTokens[0] })
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos?id={todoId}] Failure getting ToDo by ID (not found ToDo)', async () => {
    await server
      .get(`/api/todos?id=${notFoundTodoId}`)
      .set({ 'x-access-token': usersTokens[0] })
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });

  // * Post Todos
  test('[/api/todos] Success creating ToDo', async () => {
    await server
      .post('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .send(newTodo)
      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('ToDo created successfully');
      });
  });
  test('[/api/todos] Failure creating ToDo (incomplete fields)', async () => {
    await server
      .post('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .send(incompleteTodo)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Please, complete all fields');
      });
  });

  // * Put Todos
  test('[/api/todos] Success updating ToDo', async () => {
    await server
      .put('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .query({ id: firstTodoId })
      .send(updatedTodo)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure updating ToDo (not found to update)', async () => {
    await server
      .put('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .query({ id: notFoundTodoId })
      .send(updatedTodo)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure updating ToDo (wrong ToDo ID)', async () => {
    await server
      .put('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .query({ id: wrongTodoId })
      .send(updatedTodo)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure updating ToDo (missing ToDo ID)', async () => {
    await server
      .put('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .send(updatedTodo)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Missing ToDo ID to update');
      });
  });

  // * Delete Todos
  test('[/api/todos] Success deleting ToDo', async () => {
    await server
      .delete('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .query({ id: firstTodoId })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`ToDo with id ${firstTodoId} deleted successfully`);
      });
  });
  test('[/api/todos] Failure deleting ToDo (wrong ToDo ID)', async () => {
    await server
      .delete('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .query({ id: wrongTodoId })
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure deleting ToDo (not found ToDo)', async () => {
    await server
      .delete('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .query({ id: notFoundTodoId })
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure deleting ToDo (missing ToDo ID)', async () => {
    await server
      .delete('/api/todos')
      .set({ 'x-access-token': usersTokens[0] })
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Missing ToDo ID to delete');
      });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
