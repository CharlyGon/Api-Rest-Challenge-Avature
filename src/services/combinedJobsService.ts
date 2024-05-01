import { adaptInternalJob } from '../adapters/jobsAdapter';
import { listJobsService } from '../services/jobService';
import { getExternalJobsService } from '../services/externalJobsService';
import { JobFilter, JobType, UnifiedJob } from '../interfaces/jobsInterfaces'

/**
 * Get all jobs from internal and external sources, applying given filters.
 * @param filters Object containing filter criteria such as title, company, location, etc.
 * @returns A combined list of all jobs that meet the filter criteria.
 */
export const getCombinedJobsService = async (filters: JobFilter): Promise<UnifiedJob[]> => {
    try {

        if (filters.jobType === JobType.External) {
            return await getExternalJobsService(filters);;
        }

        if (filters.jobType === JobType.Internal) {
            return (await listJobsService(filters)).map(adaptInternalJob);
        }

        return [
            ...await getExternalJobsService(filters),
            ...(await listJobsService(filters)).map(adaptInternalJob)
        ];
    } catch (error) {
        console.error('Error combining jobs:', error);
        throw new Error('Internal server error');
    }
};
