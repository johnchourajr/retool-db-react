import { Pool } from "pg";
import { z } from "zod";
export declare function generateZodSchema(tableName: string, pool: Pool): Promise<z.ZodObject<any, any>>;
