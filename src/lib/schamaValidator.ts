import { Pool } from "pg";
import { z } from "zod";

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

const pgToZodType = (pgType: string, isNullable: boolean) => {
  const types: Record<string, () => z.ZodType> = {
    "character varying": () => z.string(),
    varchar: () => z.string(),
    text: () => z.string(),
    integer: () => z.number(),
    bigint: () => z.number(),
    numeric: () => z.number(),
    decimal: () => z.number(),
    boolean: () => z.boolean(),
    timestamp: () => z.date(),
    timestamptz: () => z.date(),
    date: () => z.date(),
    jsonb: () => z.record(z.unknown()),
    json: () => z.record(z.unknown()),
    uuid: () => z.string().uuid(),
  };

  let zodType = (types[pgType] || (() => z.unknown()))();
  return isNullable ? zodType.nullable() : zodType;
};

export async function generateZodSchema(
  tableName: string,
  pool: Pool,
): Promise<z.ZodObject<any, any>> {
  const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `;

  const result = await pool.query<ColumnInfo>(query, [tableName]);
  const columns = result.rows;

  const shape = columns.reduce<Record<string, z.ZodType>>(
    (acc, col) => ({
      ...acc,
      [col.column_name]: pgToZodType(col.data_type, col.is_nullable === "YES"),
    }),
    {},
  );

  return z.object(shape);
}
