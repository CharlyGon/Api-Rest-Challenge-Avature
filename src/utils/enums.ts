/**
 * For database configuration
 */
export enum DBConfig {
    MAX_RETRIES = 5,
    RETRY_INTERVAL = 5000,
}

/**
 * For job status
 */
export enum JobStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
}

/**
 * For user and job validation
 */
export enum ValidationMode {
    CREATE = 'create',
    UPDATE = 'update',
}

/**
 * For job filtering
 */
export enum JobTypeFilter {
    TITLE = 'title',
    COMPANY = 'company',
    LOCATION = 'location',
    DESCRIPTION = 'description',
}
