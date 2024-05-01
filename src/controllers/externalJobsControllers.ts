import { Request, Response } from 'express';
import { getExternalJobsService } from '../services/externalJobsService';
import { JobFilter } from '../interfaces/jobsInterfaces';

/**
 * List external jobs controller
 * @param req Request
 * @param res Response
 * @returns A list of external jobs or a filtered list of external jobs
 */
export const listExternalJobsController = async (req: Request, res: Response) => {
    try {
        const filters: JobFilter = {
            title: req.query.title as string || undefined,
            company: req.query.company as string || undefined,
            location: req.query.location as string || undefined,
            description: req.query.description as string || undefined,
        };

        const externalJobs = await getExternalJobsService(filters);
        if (externalJobs.length === 0) {
            return res.status(204).send({ message: 'No content' });
        }

        return res.status(200).json(externalJobs);
    } catch (error) {
        console.error('Error fetching external jobs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
