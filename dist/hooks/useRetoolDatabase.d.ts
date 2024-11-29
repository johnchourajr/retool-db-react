import type { RetoolDatabaseConfig, RetoolDatabaseError, RetoolDatabaseOptions } from "../types";
export declare function useRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions, config?: RetoolDatabaseConfig): {
    data: T[] | null;
    isLoading: boolean;
    error: RetoolDatabaseError | null;
    insert: (newData: Partial<T>) => Promise<any>;
    update: (where: Partial<T>, updateData: Partial<T>) => Promise<any>;
    remove: (where: Partial<T>) => Promise<any>;
    refetch: () => Promise<void>;
};
