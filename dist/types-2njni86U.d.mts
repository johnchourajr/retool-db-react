interface RetoolDatabaseConfig {
    baseUrl?: string;
}
interface RetoolDatabaseOptions {
    query?: string;
    params?: unknown[];
    limit?: number;
}
interface RetoolDatabaseError {
    message: string;
    code?: string;
    detail?: string;
}

export type { RetoolDatabaseOptions as R, RetoolDatabaseConfig as a, RetoolDatabaseError as b };
