import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { userEntity } from '../src/models/schemas/user';
import app from '../src/server/index';

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
const loginUser: any = {
  email: 'ana@email.com',
  password: 'anaPass'
};
const loginUserWrongPass: any = {
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
  test('[/api/auth/login] Success logging user', async () => {
    await server
      .post('/api/auth/login')
      .send(loginUser)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('token');
      });
  });

  test('[/api/auth/login] Failure logging user (wrong password)', async () => {
    await server
      .post('/api/auth/login')
      .send(loginUserWrongPass)
      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body.token).toBeUndefined();
      });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
