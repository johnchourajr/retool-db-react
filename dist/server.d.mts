type RetoolDatabaseOptions = {
    query?: string;
    params?: unknown[];
    limit?: number;
};

declare function queryRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions): Promise<T[]>;

export { queryRetoolDatabase };
