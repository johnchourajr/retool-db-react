import { NextRequest, NextResponse } from 'next/server';

declare function retoolDbHandler(req: NextRequest, context: {
    params: {
        tableName: string;
    } | Promise<{
        tableName: string;
    }>;
}): Promise<NextResponse<any>>;

type RetoolDatabaseOptions = {
    query?: string;
    params?: unknown[];
    limit?: number;
};

declare function queryRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions): Promise<T[]>;

export { queryRetoolDatabase, retoolDbHandler };
