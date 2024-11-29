import { Pool } from "pg";
import { RetoolDatabaseOptions } from "./types";

export async function queryRetoolDatabase<T>(
  tableName: string,
  options?: RetoolDatabaseOptions,
) {
  const pool = new Pool({
    connectionString: process.env.RETOOL_DATABASE_URL,
  });

  try {
    if (options?.query) {
      const result = await pool.query({
        text: options.query,
        values: options.params || [],
      });
      return result.rows as T[];
    }

    const result = await pool.query({
      text: `SELECT * FROM "${tableName}" LIMIT $1`,
      values: [options?.limit || 100],
    });
    return result.rows as T[];
  } catch (error) {
    throw error;
  } finally {
    await pool.end();
  }
}
