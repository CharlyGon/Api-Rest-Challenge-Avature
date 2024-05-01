import { createJobService, listJobsService } from '../src/services/jobService';
import { sequelize } from '../src/db/dbConfig';
import Job from '../src/models/jobModel';

let jobId: string;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    const job = await Job.create({
        title: 'Developer',
        description: 'Develop stuff',
        company: 'Tech Co',
        location: 'Remote',
        publishDate: new Date(),
        status: 'Active'
    });
    jobId = job.id.toString();
});

afterAll(async () => {
    await sequelize.close();
});

describe('listJobsService', () => {
    test('should retrieve list of jobs when jobs are available', async () => {
        const jobs = await listJobsService();
        expect(jobs.length).toBeGreaterThan(0)
    });

    test('should return an empty list when no jobs are available', async () => {
        await Job.destroy({ where: {} });
        const jobs = await listJobsService();
        expect(jobs.length).toBe(0);
    });

    test('should return an error when an error occurs', async () => {
        jest.spyOn(Job, 'findAll').mockRejectedValue(new Error('Database error'));
        await expect(listJobsService()).rejects.toThrow('Internal server error');
    });
});

describe('createJobService', () => {
    test('should create a new job when all required fields are provided', async () => {
        const jobData = {
            title: 'Tester',
            description: 'Test stuff',
            company: 'Tech Co',
            location: 'Remote',
            expirationDate: new Date()
        };
        const job = await createJobService(jobData);
        expect(job.title).toBe('Tester');
    });

    test('should return an error when an error occurs', async () => {
        jest.spyOn(Job, 'create').mockRejectedValue(new Error('Database error'));
        const jobData = {
            title: 'Tester',
            description: 'Test stuff',
            company: 'Tech Co',
            location: 'Remote',
            expirationDate: new Date()
        };
        await expect(createJobService(jobData)).rejects.toThrow('Internal server error');
    });
});
