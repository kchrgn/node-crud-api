import request from 'supertest';
import App from './app.js';
import {afterAll, jest} from '@jest/globals';

import * as dotenv from 'dotenv'
import { doesNotMatch } from 'assert';

dotenv.config();
const app = new App();
app.start();
// Timeout for starting child process inside app
await new Promise((r) => setTimeout(r, 2000));

const baseUrl = `localhost:${process.env.HTTP_PORT}`;

const user = {
  username: 'Вася',
  age: '46',
  hobbies: [
    'sport',
    'books',
  ]
}

const updatedUser = {
  username: 'Коля',
  age: '46',
  hobbies: [
    'sport',
    'books',
  ]
}

describe('Scenario 1 (normal operation): ', () => {
  describe("first request", () => {
      test('should return empty array and status code 200', async () => {
        const response = await request(baseUrl).get('/api/users');
        expect(response.body).toHaveLength(0);
        expect(response.statusCode).toBe(200);
      })
  })
  let userId;
  describe("create user", () => {
    test('should return same user and status code 201', async () => {
      const response = await request(baseUrl).post('/api/users').send(user);
      userId = response.body.id;
      expect(response.body).toMatchObject(user);
      expect(response.statusCode).toBe(201);
    })
  })
  describe("get user by id", () => {
    test('should return created user and status code 200', async () => {
      const response = await request(baseUrl).get(`/api/users/${userId}`);
      expect(response.body).toMatchObject(user);
      expect(response.statusCode).toBe(200);
    })
  })
  describe("update user", () => {
    test('should return updated user and status code 200', async () => {
      const response = await request(baseUrl).put(`/api/users/${userId}`).send({username: 'Коля'});
      expect(response.body).toMatchObject(updatedUser);
      expect(response.statusCode).toBe(200);
    })
  })
  describe("delete user by id", () => {
    test('should return status code 204', async () => {
      const response = await request(baseUrl).delete(`/api/users/${userId}`);
      expect(response.statusCode).toBe(204);
    })
  })
  describe("request after delete operation", () => {
    test('should return empty array', async () => {
      const response = await request(baseUrl).get('/api/users');
      expect(response.body).toHaveLength(0);
    })
  })
})

describe('Scenario 2 (GET errors): ', () => {
  describe("request with incorrect uuid", () => {
    test('should return status code 400', async () => {
      const response = await request(baseUrl).get(`/api/users/qqqqq`);
      expect(response.statusCode).toBe(400)
    })
  })
  describe("request to non exist id", () => {
      test('should return status code 404', async () => {
        const response = await request(baseUrl).get(`/api/users/1b4db7eb-1111-5ddf-91e0-36dec72071f5`);
        expect(response.statusCode).toBe(404)
      })
  })
})

describe('Scenario 3 (PUT errors): ', () => {
  describe("request with incorrect uuid", () => {
    test('should return status code 400', async () => {
      const response = await request(baseUrl).put(`/api/users/qqqqq`).send({username: 'Коля'});
      expect(response.statusCode).toBe(400)
    })
  })
  describe("request to non exist id", () => {
      test('should return status code 404', async () => {
        const response = await request(baseUrl).put(`/api/users/1b4db7eb-1111-5ddf-91e0-36dec72071f5`).send({username: 'Коля'});
        expect(response.statusCode).toBe(404)
      })
  })
})

describe('Scenario 4 (POST errors): ', () => {
  describe("request without required fields", () => {
    test('should return status code 400', async () => {
      const response = await request(baseUrl).post(`/api/users`).send({username: 'Коля'});
      expect(response.statusCode).toBe(400)
    })
  })
})

describe('Scenario 5 (DELETE errors): ', () => {
  describe("request with incorrect uuid", () => {
    test('should return status code 400', async () => {
      const response = await request(baseUrl).delete(`/api/users/qqqqq`).send({username: 'Коля'});
      expect(response.statusCode).toBe(400)
    })
  })
  describe("request to non exist id", () => {
      test('should return status code 404', async () => {
        const response = await request(baseUrl).delete(`/api/users/1b4db7eb-1111-5ddf-91e0-36dec72071f5`).send({username: 'Коля'});
        expect(response.statusCode).toBe(404)
      })
  })
})