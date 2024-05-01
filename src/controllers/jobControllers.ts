import { Request, Response } from 'express';
import { createJobService, deleteJobService, getJobByIdService, listJobsService, updateJobService, validateJobFields } from '../services/jobService';
import { JobInput } from '../interfaces/jobInput';
import { ValidationMode } from '../utils/enums';
import { JobFilter } from '../interfaces/jobsInterfaces';

/**
 * Controller to list all jobs
 * @param req Request
 * @param res Response
 * @returns A list of all jobs that match the filters, or an error if the jobs could not be listed
 */
export const listJobsController = async (req: Request, res: Response) => {
    try {
        const filters: JobFilter = {
            title: req.query.title as string || undefined,
            company: req.query.company as string || undefined,
            location: req.query.location as string || undefined,
            description: req.query.description as string || undefined,
        };

        const jobs = await listJobsService(filters);
        if (jobs.length === 0) {
            return res.status(204).json({ message: 'No content' });
        }

        return res.status(200).json(jobs);
    } catch (error) {
        console.error('Error listing jobs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * This controller gets a job by id
 * @param req Request
 * @param res Response
 * @returns The job with the specified id, or an error if the job is not found
 */
export const getJobByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await getJobByIdService(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        return res.status(200).json(job);
    } catch (error) {
        console.error('Error getting job by id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Create a new job
 * @param req Request
 * @param res Response
 * @returns The created job, or an error if the job could not be created
 */
export const createJobController = async (req: Request, res: Response) => {
    try {
        const jobData: JobInput = req.body;
        if (!validateJobFields(jobData, ValidationMode.CREATE)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newJob = await createJobService(jobData);
        if (!newJob) {
            return res.status(500).json({ error: 'Failed to create job' });
        }

        return res.status(201).json(newJob);
    } catch (error) {
        console.error('Error creating job:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Update a job by id
 * @param req Request
 * @param res Response
 * @returns The updated job, or an error if the job could not be updated
 */
export const updateJobByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const jobData = req.body;

        if (!validateJobFields(jobData, ValidationMode.UPDATE)) {
            return res.status(400).json({ error: 'No data provided' });
        }

        const job = await getJobByIdService(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const jobUpdate = await updateJobService(id, jobData);
        return res.status(200).json(jobUpdate);
    } catch (error) {
        console.error('Error updating job:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Delete a job by id
 * @param req Request
 * @param res Response
 * @returns A message indicating that the job was deleted successfully, or an error if the job could not be deleted
 */
export const deleteJobByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await getJobByIdService(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        await deleteJobService(id);
        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
