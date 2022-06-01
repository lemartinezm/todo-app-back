import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server/index';

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
  },
  {
    username: 'ana123',
    email: 'ana@email.com',
    password: 'anaPass'
  }
];
const newUser: any = {
  username: 'claudia123',
  email: 'claudia@email.com',
  password: 'claudiaPass'
};
const updatedUser: any = {
  username: 'claudia12345',
  email: 'claudia123@email.com',
  password: 'claudiaPass'
};
let firstUserId: string;

// Server for tests
const server = request(app);

beforeEach(() => {
  // TODO: add usersForTest in test DB
});

describe('Users Tests', () => {
  test('[/api/users] Success getting all users', async () => {
    await server
      .get('/api/users')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.users).toHaveLength(usersForTest.length);
      });
  });

  test('[/api/users] Success getting user by ID', async () => {
    await server
      .get('/api/users')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.users).toHaveLength(1);
      });
  });

  test('[/api/users] Success creating user', async () => {
    await server
      .post('/api/users')
      .send(newUser)
      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('User created successfully');
      });
  });

  test('[/api/users?id={userId}] Success updating user', async () => {
    await server
      .put('/api/users')
      .query(firstUserId)
      .send(updatedUser)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('User updated successfully');
      });
  });

  test('[/api/users?id={userId}] Success deleting user', async () => {
    await server
      .delete('/api/users')
      .query(firstUserId)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('User deleted successfully');
      });
  });
});

// TODO: add possible failure tests

afterAll(() => {
  mongoose.connection.close();
});
