export interface UnifiedJob {
    title: string;
    company?: string;
    location?: string;
    salary?: number;
    country?: string;
    skills?: string[];
    description?: string;
    publishDate?: Date;
    expirationDate?: Date;
}

export enum JobType {
    Internal = "internal",
    External = "external"
}

export interface JobFilter {
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    jobType?: JobType;
}

export interface ExternalJob {
    title: string;
    company: string;
    salary: number;
    location: string;
    description: string;
}
