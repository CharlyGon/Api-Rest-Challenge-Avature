import request from 'supertest';
import express from 'express';
import * as userService from '../src/services/userService';
import { createUserController, getUserByIdController, listUsersController, updateUserByIdController, deleteUserByIdController } from '../src/controllers/userControllers';
import User from '../src/models/userModel';

describe('User Controller Tests', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.get('/api/users', listUsersController);
        app.get('/api/users/:id', getUserByIdController);
        app.post('/api/users', createUserController);
        app.put('/api/users/:id', updateUserByIdController);
        app.delete('/api/users/:id', deleteUserByIdController);
    });

    describe('GET /api/users', () => {
        it('should list all users', async () => {
            const response = await request(app).get('/api/users');
            expect(response.status).toBe(204);
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(userService, 'listUsersService').mockImplementation(() => {
                throw new Error('Simulated error');
            });

            const response = await request(app).get('/api/users');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user with status code 200 if user is found', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockResolvedValue({
                id: 1,
                username: 'John Doe',
                email: 'test@test.com',
                password: '123456',
                role: 'admin',
                firstName: 'John',
                lastName: 'Doe',
            } as User);

            const response = await request(app).get('/api/users/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                username: 'John Doe',
                email: 'test@test.com',
                password: '123456',
                role: 'admin',
                firstName: 'John',
                lastName: 'Doe',
            });
        });

        it('should return 404 status code if user is not found', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockResolvedValue(null);

            const response = await request(app).get('/api/users/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });

        it('should return 500 status code if there is an internal server error', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockRejectedValue(new Error('Internal server error'));

            const response = await request(app).get('/api/users/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('POST /api/users', () => {
        it('should return status code 201 and created user data if user is created successfully', async () => {
            jest.spyOn(userService, 'createUserService').mockResolvedValue({
                id: 1,
                username: 'testuser',
                email: 'testuser@example.com',
                role: 'user'
            } as User);

            const userData = { username: 'testuser', email: 'testus@example.com', password: 'testpassword', role: 'user' };
            const response = await request(app).post('/api/users').send(userData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1, username: 'testuser', email: 'testuser@example.com', role: 'user' });
        });

        it('should return status code 400 if required fields are missing', async () => {
            const userData = { username: 'testuser', email: 'testuser@example.com' };
            const response = await request(app).post('/api/users').send(userData);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Missing required fields or Password must be at least 6 characters' });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should return status code 200 and updated user data if user is updated successfully', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockResolvedValue({
                id: 1,
                firstName: 'user'
            } as User);
            jest.spyOn(userService, 'updateUserService').mockResolvedValue({
                id: 1,
                firstName: 'user'
            } as User);

            const userData = { firstName: 'Test' };
            const response = await request(app).put('/api/users/1').send(userData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, firstName: 'user' });
        });

        it('should return status code 404 if user is not found', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockResolvedValue(null);

            const userData = { firstName: 'Test' };
            const response = await request(app).put('/api/users/1').send(userData);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });

        it('should return status code 500 if there is an internal server error', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockRejectedValue(new Error('Internal server error'));

            const userData = { firstName: 'Test' };
            const response = await request(app).put('/api/users/1').send(userData);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });

    });

    describe('DELETE /api/users/:id', () => {
        it('should return status code 204 if user is deleted successfully', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockResolvedValue({
                id: 1,
                username: 'testuser',
                email: 'test@test.com',
                role: 'user'
            } as User);
            jest.spyOn(userService, 'deleteUserService').mockResolvedValue(true);

            const response = await request(app).delete('/api/users/1');
            expect(response.status).toBe(200);
        });

        it('should return status code 404 if user is not found', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockResolvedValue(null);

            const response = await request(app).delete('/api/users/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });

        it('should return status code 500 if there is an internal server error', async () => {
            jest.spyOn(userService, 'getUserByIdService').mockRejectedValue(new Error('Internal server error'));

            const response = await request(app).delete('/api/users/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });
});
