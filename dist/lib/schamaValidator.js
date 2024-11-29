var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z } from "zod";
const pgToZodType = (pgType, isNullable) => {
    const types = {
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
export function generateZodSchema(tableName, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `;
        const result = yield pool.query(query, [tableName]);
        const columns = result.rows;
        const shape = columns.reduce((acc, col) => (Object.assign(Object.assign({}, acc), { [col.column_name]: pgToZodType(col.data_type, col.is_nullable === "YES") })), {});
        return z.object(shape);
    });
}
//# sourceMappingURL=schamaValidator.js.map