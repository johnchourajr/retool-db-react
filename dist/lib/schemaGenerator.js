var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const pgToTsType = (pgType, isNullable) => {
    const types = {
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
export function generateTableTypes(tableName, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `;
        const result = yield pool.query(query, [tableName]);
        const columns = result.rows;
        let typeDefinition = `export interface ${tableName.charAt(0).toUpperCase() + tableName.slice(1)} {\n`;
        columns.forEach((col) => {
            const isNullable = col.is_nullable === "YES";
            const tsType = pgToTsType(col.data_type, isNullable);
            typeDefinition += `  ${col.column_name}: ${tsType};\n`;
        });
        typeDefinition += "}";
        return typeDefinition;
    });
}
//# sourceMappingURL=schemaGenerator.js.map