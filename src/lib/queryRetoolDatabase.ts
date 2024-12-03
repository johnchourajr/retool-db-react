import postgres from "postgres";
import { RetoolDatabaseOptions } from "../types";

export async function queryRetoolDatabase<T>(
  tableName: string,
  options?: RetoolDatabaseOptions,
) {
  const sql = postgres(process.env.RETOOL_DATABASE_URL!);

  try {
    if (options?.query) {
      const result = await sql.unsafe(
        options.query,
        (options.params as any[]) || [],
      );
      return result as unknown as T[];
    }

    const result = await sql.unsafe(`SELECT * FROM "${tableName}" LIMIT $1`, [
      options?.limit || 100,
    ]);
    return result as unknown as T[];
  } finally {
    await sql.end();
  }
}
