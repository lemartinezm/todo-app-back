import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server/index';

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
});

afterAll(() => {
  mongoose.connection.close();
});
