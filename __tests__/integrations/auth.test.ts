import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { userEntity } from '../../src/models/schemas/user';
import app from '../../src/server/index';

// Data for tests
const usersForTest: any[] = [
  {
    username: 'jose123',
    email: 'jose@email.com',
    password: bcrypt.hashSync('josePass', 8)
  },
  {
    username: 'martin123',
    email: 'martin@email.com',
    password: bcrypt.hashSync('martinPass', 8)
  },
  {
    username: 'ana123',
    email: 'ana@email.com',
    password: bcrypt.hashSync('anaPass', 8)
  }
];
const newUser: any = {
  username: 'claudia123',
  email: 'claudia@email.com',
  password: 'claudiaPass'
};
const incompleteUser: any = {
  username: 'luis123'
};
const loginWithEmail: any = {
  email: 'ana@email.com',
  password: 'anaPass'
};
const loginWithWrongEmail: any = {
  email: 'ana123@email.com',
  password: 'anaPass'
};
const loginWithUsername: any = {
  username: 'jose123',
  password: 'josePass'
};
const loginWithWrongUsername: any = {
  username: 'jose123123',
  password: 'josePass'
};
const loginWithWrongPass: any = {
  email: 'jose@email.com',
  password: 'sdf1fg645'
};

// Server for tests
const server = request(app);

beforeEach(async () => {
  const userModel = userEntity();
  await userModel.deleteMany({});
  await userModel.create(usersForTest);
});

describe('Auth Tests', () => {
  // * Register Tests
  test('[/api/auth/register] Success registering user', async () => {
    await server
      .post('/api/auth/register')
      .send(newUser)
      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('User registered successfully');
      });
  });

  test('[/api/auth/register] Failure registering user (incomplete user)', async () => {
    await server
      .post('/api/auth/register')
      .send(incompleteUser)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Please, complete all fields');
      });
  });

  // * Login Tests
  test('[/api/auth/login] Success logging user with email', async () => {
    await server
      .post('/api/auth/login')
      .send(loginWithEmail)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('token');
      });
  });

  test('[/api/auth/login] Success logging user with username', async () => {
    await server
      .post('/api/auth/login')
      .send(loginWithUsername)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('token');
      });
  });

  test('[/api/auth/login] Failure logging user with email (wrong password)', async () => {
    await server
      .post('/api/auth/login')
      .send(loginWithWrongPass)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.token).toBeUndefined();
      });
  });

  test('[/api/auth/login] Failure logging user (wrong username)', async () => {
    await server
      .post('/api/auth/login')
      .send(loginWithWrongUsername)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.token).toBeUndefined();
      });
  });

  test('[/api/auth/login] Failure logging user (wrong email)', async () => {
    await server
      .post('/api/auth/login')
      .send(loginWithWrongEmail)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.token).toBeUndefined();
      });
  });

  test('[/api/auth/login] Failure logging user (missing data)', async () => {
    await server
      .post('/api/auth/login')
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe('Please, provide an email or username');
      });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
