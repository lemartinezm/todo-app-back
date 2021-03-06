import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../src/server/index';

// Server for tests
const server = request(app);

describe('Home Test', () => {
  test('api route /api', async () => {
    await server
      .get('/api')
      .then((response) => {
        expect(response.body.status).toEqual(200);
      });
  });
  test('redirection to api route', async () => {
    await server
      .get('/')
      .then((response) => {
        expect(response.status).toEqual(302);
      });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
