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

beforeEach(async () => {
  const todoModel = todoEntity();
  await todoModel.deleteMany({});
  await todoModel.create(todosForTest).then(todosReturned => { firstTodoId = todosReturned[0]._id.toString(); });
});

describe('ToDos Tests', () => {
  test('[/api/todos] Success getting All ToDos', async () => {
    await server
      .get('/api/todos')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(todosForTest.length);
      });
  });
  test('[/api/todos?id={todoId}] Success getting ToDo by ID', async () => {
    await server
      .get(`/api/todos?id=${firstTodoId}`)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.todos).toHaveLength(1);
      });
  });
  test('[/api/todos?id={todoId}] Failure getting ToDo by ID (incomplete ToDo ID)', async () => {
    await server
      .get(`/api/todos?id=${wrongTodoId}`)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos?id={todoId}] Failure getting ToDo by ID (not found ToDo)', async () => {
    await server
      .get(`/api/todos?id=${notFoundTodoId}`)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
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
  test('[/api/todos] Failure creating ToDo (incomplete fields)', async () => {
    await server
      .post('/api/todos')
      .send(incompleteTodo)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Please, complete all fields');
      });
  });
  test('[/api/todos] Success updating ToDo', async () => {
    await server
      .put('/api/todos')
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
      .send(updatedTodo)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Missing ToDo ID to update');
      });
  });
  test('[/api/todos] Success deleting ToDo', async () => {
    await server
      .delete('/api/todos')
      .query({ id: firstTodoId })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`ToDo with id ${firstTodoId} deleted successfully`);
      });
  });
  test('[/api/todos] Failure deleting ToDo (wrong ToDo ID)', async () => {
    await server
      .delete('/api/todos')
      .query({ id: wrongTodoId })
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure deleting ToDo (not found ToDo)', async () => {
    await server
      .delete('/api/todos')
      .query({ id: notFoundTodoId })
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });
  test('[/api/todos] Failure deleting ToDo (missing ToDo ID)', async () => {
    await server
      .delete('/api/todos')
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Missing ToDo ID to delete');
      });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
