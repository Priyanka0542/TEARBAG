import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server';
import User from '../src/models/User';

describe('API Smoke Tests', () => {
  beforeAll(async () => {
    // MongoDB connection is handled in server.ts, but let's wait a bit for it to connect
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Clear user collection for fresh start
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let userToken = '';

  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/register should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('POST /api/auth/login should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  it('GET /api/entries should require auth', async () => {
    const res = await request(app).get('/api/entries');
    expect(res.status).toBe(401);
  });

  it('GET /api/entries should return empty array for new user', async () => {
    const res = await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
