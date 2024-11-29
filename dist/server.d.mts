import { R as RetoolDatabaseOptions } from './types-2njni86U.mjs';

declare function queryRetoolDatabase<T>(tableName: string, options?: RetoolDatabaseOptions): Promise<T[]>;

export { queryRetoolDatabase };
