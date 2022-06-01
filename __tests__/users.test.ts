import mongoose from 'mongoose';
import request from 'supertest';
import { userEntity } from '../src/models/schemas/user';
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
const incompleteUser: any = {
  username: 'luis123'
};
let firstUserId: string;
const wrongUserId: string = '1a9a7f0584019a636a3';
const notFoundUserId: string = '1a9a7fc7405840159af636a3';

// Server for tests
const server = request(app);

beforeEach(async () => {
  const userModel = userEntity();
  await userModel.deleteMany();
  await userModel.create(usersForTest).then(users => { firstUserId = users[0]._id.toString(); });
});

describe('Users Tests', () => {
  // * Get Tests

  test('[/api/users] Success getting all users', async () => {
    await server
      .get('/api/users')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.users).toHaveLength(usersForTest.length);
      });
  });

  test('[/api/users?id={userID}] Success getting user by ID', async () => {
    await server
      .get('/api/users')
      .query({ id: firstUserId })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.users).toHaveLength(1);
      });
  });

  test('[/api/users?id={userID}] Failure getting user by ID (wrong ID)', async () => {
    await server
      .get('/api/users')
      .query({ id: wrongUserId })
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });

  test('[/api/users?id={userID}] Failure getting user by ID (not found User)', async () => {
    await server
      .get('/api/users')
      .query({ id: notFoundUserId })
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });

  // * POST Tests

  test('[/api/users] Success creating user', async () => {
    await server
      .post('/api/users')
      .send(newUser)
      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('User created successfully');
      });
  });

  test('[/api/users] Failure creating user (missing fields)', async () => {
    await server
      .post('/api/users')
      .send(incompleteUser)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Please, complete all fields');
      });
  });

  // * PUT Tests

  test('[/api/users?id={userId}] Success updating user', async () => {
    await server
      .put('/api/users')
      .query({ id: firstUserId })
      .send(updatedUser)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('User updated successfully');
      });
  });

  test('[/api/users?id={userId}] Failure updating user (wrong ID)', async () => {
    await server
      .put('/api/users')
      .query({ id: wrongUserId })
      .send(updatedUser)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });

  test('[/api/users?id={userId}] Failure updating user (user not found)', async () => {
    await server
      .put('/api/users')
      .query({ id: notFoundUserId })
      .send(updatedUser)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });

  test('[/api/users?id={userId}] Failure updating user (missing ID)', async () => {
    await server
      .put('/api/users')
      .send(updatedUser)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Missing User ID to update');
      });
  });

  // * DELETE Tests

  test('[/api/users?id={userId}] Success deleting user', async () => {
    await server
      .delete('/api/users')
      .query({ id: firstUserId })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('User deleted successfully');
      });
  });

  test('[/api/users?id={userId}] Failure deleting user (wrong ID)', async () => {
    await server
      .delete('/api/users')
      .query({ id: wrongUserId })
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBeDefined();
      });
  });

  test('[/api/users?id={userId}] Failure deleting user (user not found)', async () => {
    await server
      .delete('/api/users')
      .query({ id: notFoundUserId })
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toBeDefined();
      });
  });

  test('[/api/users?id={userId}] Failure deleting user (missing ID)', async () => {
    await server
      .delete('/api/users')
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Missing User ID to delete');
      });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
