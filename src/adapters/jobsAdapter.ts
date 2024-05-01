import { UnifiedJob } from '../interfaces/jobsInterfaces';
import { JobAttributes } from '../models/jobModel';

/**
 *  Adapt an internal job to the unified format
 * @param job  Internal job
 * @returns  Unified job
 */
export const adaptInternalJob = (job: JobAttributes): UnifiedJob => ({
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    publishDate: job.publishDate,
    expirationDate: job.expirationDate
});

type ExternalJobArray = [string, number, string, string[]];

/**
 *  Adapt an external job to the unified format
 * @param job  External job
 * @returns  Unified job
 * Assuming the data comes as an array of arrays
 */
export const adaptExternalJob = (job: ExternalJobArray): UnifiedJob => {
    return {
        title: job[0] ?? 'No title provided',
        salary: job[1] ?? undefined,
        location: job[2] ?? 'No country provided',
        description: 'No description provided',
        skills: job.length > 3 && Array.isArray(job[3]) ? job[3] : [],
    };
};
