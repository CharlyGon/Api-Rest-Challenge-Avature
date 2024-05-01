import Job from '../models/jobModel';
import { JobInput } from '../interfaces/jobInput';
import { JobStatus, JobTypeFilter, ValidationMode } from '../utils/enums';
import { Op } from 'sequelize';
import { JobFilter } from '../interfaces/jobsInterfaces';
import { WhereClause } from '../interfaces/db';

/**
 * List all jobs
 * @param filters Job filters
 * @returns A list the all jobs or a filtered list of jobs
 */
export const listJobsService = async (filters: JobFilter): Promise<Job[]> => {
    const where: WhereClause = {};

    if (filters.title) {
        where[JobTypeFilter.TITLE] = { [Op.like]: `%${filters.title}%` };
    }
    if (filters.company) {
        where[JobTypeFilter.COMPANY] = { [Op.like]: `%${filters.company}%` };
    }
    if (filters.location) {
        where[JobTypeFilter.LOCATION] = { [Op.like]: `%${filters.location}%` };
    }
    if (filters.description) {
        where[JobTypeFilter.DESCRIPTION] = { [Op.like]: `%${filters.description}%` };
    }

    return Job.findAll({ where });
};

/**
 * Get a job by id
 * @param id Job id
 * @returns The job with the specified id or null if the job is not found
 * @throws An error if the id is not provided or if there is an internal server error
 */
export const getJobByIdService = async (id: string): Promise<Job | null> => {
    try {
        if (!id) {
            throw new Error('No id provided');
        }

        const job = await Job.findByPk(id);
        if (!job) {
            console.error('Job not found');
            return null;
        }

        return job;
    } catch (error) {
        console.error('Error getting job by id:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Create a new job
 * @param jobData Job data
 * @returns The created job, or an error if the job could not be created
 */
export const createJobService = async (jobData: JobInput): Promise<Job> => {
    try {
        const publishDate = new Date();
        const status = JobStatus.ACTIVE;

        if (!validateJobFields(jobData, ValidationMode.CREATE)) {
            throw new Error('Missing required fields');
        }

        return await Job.create({ ...jobData, publishDate, status });
    } catch (error) {
        console.error('Error creating job:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Update a job by id
 * @param id Job id
 * @param jobData Job data
 * @returns The updated job, or an error if the job could not be updated
 */
export const updateJobService = async (id: string, jobData: JobInput): Promise<Job | null> => {
    try {
        if (!validateJobFields(jobData, ValidationMode.UPDATE)) {
            throw new Error('No data provided');
        }

        const job = await getJobByIdService(id);
        if (!job) {
            console.error('Job not found');
            return null;
        }

        return await job.update(jobData);
    } catch (error) {
        console.error('Error updating job:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Delete a job by id
 * @param id Job id
 * @returns True if the job is deleted successfully, false otherwise
 */
export const deleteJobService = async (id: string): Promise<boolean> => {
    try {
        const job = await getJobByIdService(id);
        if (!job) {
            console.error('Job not found');
            return false;
        }

        await job.destroy();
        return true;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Validate job fields based on the specified validation mode
 * @param jobData Job data
 * @param mode Validation mode, either for creation or update
 * @returns True if the condition based on the mode is met, false otherwise
 */
export const validateJobFields = (jobData: JobInput, mode: ValidationMode): boolean => {
    const requiredFields: (keyof JobInput)[] = ['title', 'description', 'company', 'expirationDate'];

    if (mode === ValidationMode.CREATE) {
        // All required fields must be present and not empty for creation
        return requiredFields.every(field => jobData[field] !== undefined && jobData[field] !== '');
    } else {
        // At least one required field must be present and not empty for update
        return requiredFields.some(field => jobData[field] !== undefined && jobData[field] !== '');
    }
}
