export interface RetoolDatabaseConfig {
    baseUrl?: string;
}
export interface RetoolDatabaseOptions {
    query?: string;
    params?: unknown[];
    limit?: number;
}
export type RetoolMutationType = "INSERT" | "UPDATE" | "DELETE";
export interface RetoolMutation {
    type: RetoolMutationType;
    data?: Record<string, unknown>;
    where?: Record<string, unknown>;
}
export interface RetoolDatabaseError {
    message: string;
    code?: string;
    detail?: string;
}
