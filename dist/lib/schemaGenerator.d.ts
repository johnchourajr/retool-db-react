import { Pool } from "pg";
export declare function generateTableTypes(tableName: string, pool: Pool): Promise<string>;
