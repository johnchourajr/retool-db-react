import { R as RetoolDatabaseOptions, a as RetoolDatabaseConfig, b as RetoolDatabaseError } from './types-2njni86U.mjs';
import { NextRequest, NextResponse } from 'next/server';

declare function useRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions, config?: RetoolDatabaseConfig): {
    data: T[] | null;
    isLoading: boolean;
    error: RetoolDatabaseError | null;
    insert: (newData: Partial<T>) => Promise<any>;
    update: (where: Partial<T>, updateData: Partial<T>) => Promise<any>;
    remove: (where: Partial<T>) => Promise<any>;
    refetch: () => Promise<void>;
};

declare function retoolDbHandler(req: NextRequest, { params }: {
    params: {
        tableName: string;
    };
}): Promise<NextResponse<any>>;

export { retoolDbHandler, useRetoolDatabase };
