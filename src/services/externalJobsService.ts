import axios from 'axios';
import { adaptExternalJob } from '../adapters/jobsAdapter';
import { ExternalJob, JobFilter } from '../interfaces/jobsInterfaces';

const applyFilter = <T>(items: T[], filterValue: string | undefined, predicate: (item: T) => string | undefined): T[] => {
    if (!filterValue) {
        return items;
    }

    const lowerFilter = filterValue.toLowerCase();

    return items.filter(item => {
        const value = predicate(item);
        return value ? value.toLowerCase().includes(lowerFilter) : false;
    });
};

/**
* Fetches external jobs from an external API, applies filters to the retrieved jobs.
* @param filters Search filters to apply to the job listings.
* @returns An array of filtered external jobs.
*/
export const getExternalJobsService = async (filters: JobFilter) => {
    try {
        const apiUrl = process.env.EXTERNAL_API_JOB_URL;
        if (!apiUrl) {
            throw new Error('External API job URL is not defined');
        }

        const response = await axios.get(apiUrl);

        // Convert and filter jobs
        let jobs = response.data.map((job: [string, number, string, string[]]) => adaptExternalJob(job));

        // Apply filters with auxiliary function
        jobs = applyFilter(jobs, filters.title, (job: ExternalJob) => job.title);
        jobs = applyFilter(jobs, filters.company, (job: ExternalJob) => job.company);
        jobs = applyFilter(jobs, filters.location, (job: ExternalJob) => job.location);
        jobs = applyFilter(jobs, filters.description, (job: ExternalJob) => job.description);

        return jobs;
    } catch (error) {
        console.error('Error fetching external jobs:', error);
        throw new Error('Failed to fetch external jobs');
    }
};
