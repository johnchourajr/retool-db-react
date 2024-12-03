interface RetoolDatabaseConfig {
    baseUrl?: string;
    validate?: (data: any) => Promise<any> | any;
}
type RetoolDatabaseOptions = {
    query?: string;
    params?: unknown[];
    limit?: number;
};
type RetoolDatabaseError = {
    message: string;
    code?: string;
    detail?: string;
};

declare function useRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions, config?: RetoolDatabaseConfig): {
    data: T[] | null;
    isLoading: boolean;
    error: RetoolDatabaseError | null;
    insert: (newData: Partial<T>) => Promise<any>;
    update: (where: Partial<T>, updateData: Partial<T>) => Promise<any>;
    remove: (where: Partial<T>) => Promise<any>;
    refetch: () => Promise<void>;
};

export { useRetoolDatabase };
