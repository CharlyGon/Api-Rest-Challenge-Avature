import { Request, Response } from 'express';
import { getCombinedJobsService } from '../services/combinedJobsService';
import { JobFilter,JobType} from '../interfaces/jobsInterfaces';


/**
 * Get all jobs from internal and external sources
 * @param req Request
 * @param res Response
 * @returns A list of all jobs, or the jobs that match the filters
 */
export const listCombinedJobsController = async (req: Request, res: Response) => {
    try {
        const filters: JobFilter = {
            title: req.query.title as string || undefined,
            company: req.query.company as string || undefined,
            location: req.query.location as string || undefined,
            description: req.query.description as string || undefined,
            jobType: JobType[req.query.jobs as keyof typeof JobType] || undefined,
        }

        const combinedJobs = await getCombinedJobsService(filters);
        if (combinedJobs.length === 0) {
            return res.status(204).send({ message: 'No content' });
        }

        return res.status(200).json(combinedJobs);
    } catch (error) {
        console.error('Error fetching combined jobs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
