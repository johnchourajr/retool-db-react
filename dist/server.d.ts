import { NextRequest } from 'next/server';

declare function retoolDbHandler(req: NextRequest, { params }: {
    params: Promise<{
        tableName: string;
    }>;
}): Promise<Response>;

type RetoolDatabaseOptions = {
    query?: string;
    params?: unknown[];
    limit?: number;
};

declare function queryRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions): Promise<T[]>;

export { queryRetoolDatabase, retoolDbHandler };
