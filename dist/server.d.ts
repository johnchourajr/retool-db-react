import { NextRequest } from 'next/server';

type RetoolDatabaseOptions = {
    query?: string;
    params?: unknown[];
    limit?: number;
};
type RouteParams = {
    params: {
        tableName: string;
    };
};

declare function retoolDbHandler(req: NextRequest, { params }: RouteParams): Promise<Response>;

declare function queryRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions): Promise<T[]>;

export { queryRetoolDatabase, retoolDbHandler };
