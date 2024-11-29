import { Pool } from "pg";

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

const pgToTsType = (pgType: string, isNullable: boolean): string => {
  const types: Record<string, string> = {
    "character varying": "string",
    varchar: "string",
    text: "string",
    integer: "number",
    bigint: "number",
    numeric: "number",
    decimal: "number",
    boolean: "boolean",
    timestamp: "Date",
    timestamptz: "Date",
    date: "Date",
    jsonb: "Record<string, unknown>",
    json: "Record<string, unknown>",
    uuid: "string",
  };

  const tsType = types[pgType] || "unknown";
  return isNullable ? `${tsType} | null` : tsType;
};

export async function generateTableTypes(
  tableName: string,
  pool: Pool,
): Promise<string> {
  const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `;

  const result = await pool.query<ColumnInfo>(query, [tableName]);
  const columns = result.rows;

  let typeDefinition = `export interface ${tableName.charAt(0).toUpperCase() + tableName.slice(1)} {\n`;

  columns.forEach((col) => {
    const isNullable = col.is_nullable === "YES";
    const tsType = pgToTsType(col.data_type, isNullable);
    typeDefinition += `  ${col.column_name}: ${tsType};\n`;
  });

  typeDefinition += "}";
  return typeDefinition;
}
