import express from 'express';
import request from 'supertest';
import * as jobService from '../src/services/jobService';
import { createJobController, deleteJobByIdController, getJobByIdController, listJobsController, updateJobByIdController } from '../src/controllers/jobControllers';
import Job from '../src/models/jobModel';

describe('Job Controllers', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.get('/api/jobs', listJobsController);
        app.get('/api/jobs/:id', getJobByIdController);
        app.post('/api/jobs', createJobController);
        app.put('/api/jobs/:id', updateJobByIdController);
        app.delete('/api/jobs/:id', deleteJobByIdController);
    });

    describe('GET /api/jobs', () => {
        it('should list all jobs', async () => {
            jest.spyOn(jobService, 'listJobsService').mockResolvedValue([] as any);
            const response = await request(app).get('/api/jobs');
            expect(response.status).toBe(204);
        });

        it('should return 200 if jobs are found', async () => {
            jest.spyOn(jobService, 'listJobsService').mockResolvedValue([{
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            } as Job]);

            const response = await request(app).get('/api/jobs');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            }]);
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(jobService, 'listJobsService').mockImplementation(() => {
                throw new Error('Simulated error');
            });

            const response = await request(app).get('/api/jobs');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('GET /api/jobs/:id', () => {
        it('should return job with status code 200 if job is found', async () => {
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            } as Job);

            const response = await request(app).get('/api/jobs/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            });
        });

        it('should return 404 if job is not found', async () => {
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue(null);

            const response = await request(app).get('/api/jobs/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Job not found' });
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(jobService, 'getJobByIdService').mockImplementation(() => {
                throw new Error('Simulated error');
            });

            const response = await request(app).get('/api/jobs/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('POST /api/jobs', () => {
        it('should create a new job', async () => {
            jest.spyOn(jobService, 'createJobService').mockResolvedValue({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
                expirationDate: new Date(),
            } as Job);
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(true);

            const jobData = {
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            };
            const response = await request(app).post('/api/jobs').send(jobData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
                expirationDate: expect.any(String),
            });
        });

        it('should return 400 if required fields are missing', async () => {
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(false);

            const response = await request(app).post('/api/jobs').send({});
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Missing required fields' });
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(true);
            jest.spyOn(jobService, 'createJobService').mockImplementation(() => {
                throw new Error('Simulated error');
            });

            const response = await request(app).post('/api/jobs').send({});
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('PUT /api/jobs/:id', () => {
        it('should return status code 200 and updated job data if job is updated successfully', async () => {
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(true);
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            } as Job);
            jest.spyOn(jobService, 'updateJobService').mockResolvedValue({
                id: 1,
                title: 'test',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            } as Job);

            const jobData = { title: 'Test' };
            const response = await request(app).put('/api/jobs/1').send(jobData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                title: 'test',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            });
        });

        it('should return status code 400 if no data is provided', async () => {
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(false);

            const jobData = {};
            const response = await request(app).put('/api/jobs/1').send(jobData);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'No data provided' });
        });

        it('should return status code 404 if job is not found', async () => {
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(true);
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue(null);

            const jobData = { title: 'Test' };
            const response = await request(app).put('/api/jobs/1').send(jobData);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Job not found' });
        });

        it('should return status code 500 if there is an internal server error', async () => {
            jest.spyOn(jobService, 'validateJobFields').mockReturnValue(true);
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            } as Job);
            jest.spyOn(jobService, 'updateJobService').mockRejectedValue(new Error('Internal server error'));

            const jobData = { title: 'Test' };
            const response = await request(app).put('/api/jobs/1').send(jobData);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('DELETE /api/jobs/:id', () => {
        it('should return status code 204 if job is deleted successfully', async () => {
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue({
                id: 1,
                title: 'Software Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Work on exciting projects at Google!',
            } as Job);
            jest.spyOn(jobService, 'deleteJobService').mockResolvedValue(true);

            const response = await request(app).delete('/api/jobs/1');
            expect(response.status).toBe(200);
        });

        it('should return status code 404 if job is not found', async () => {
            jest.spyOn(jobService, 'getJobByIdService').mockResolvedValue(null);

            const response = await request(app).delete('/api/jobs/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Job not found' });
        });

        it('should return status code 500 if there is an internal server error', async () => {
            jest.spyOn(jobService, 'getJobByIdService').mockRejectedValue(new Error('Internal server error'));

            const response = await request(app).delete('/api/jobs/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });
});
