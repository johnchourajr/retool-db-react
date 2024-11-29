var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from "next/server";
import { Pool } from "pg";
const pool = new Pool({
    connectionString: process.env.RETOOL_DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
function handleSelect(tableName, body) {
    return __awaiter(this, void 0, void 0, function* () {
        if (body.query) {
            const result = yield pool.query({
                text: body.query,
                values: body.params || [],
            });
            return NextResponse.json(result.rows);
        }
        const result = yield pool.query({
            text: `SELECT * FROM "${tableName}" LIMIT $1`,
            values: [body.limit || 100],
        });
        return NextResponse.json(result.rows);
    });
}
export function retoolDbHandler(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        var _b;
        if (!["GET", "POST", "PUT", "DELETE"].includes(req.method || "")) {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
        }
        const { tableName } = params;
        try {
            // Validate table name format
            if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
                throw new Error("Invalid table name format");
            }
            // Get request body with default empty object
            let body = {};
            const contentType = req.headers.get("content-type");
            if (contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json")) {
                try {
                    const text = yield req.text();
                    body = text ? JSON.parse(text) : {};
                }
                catch (e) {
                    console.warn("Failed to parse JSON body:", e);
                }
            }
            // Verify table exists
            const tableExists = yield pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = $1
      )
    `, [tableName]);
            if (!tableExists.rows[0].exists) {
                return NextResponse.json({ error: `Table '${tableName}' does not exist` }, { status: 404 });
            }
            switch (req.method) {
                case "POST": {
                    if (((_b = body.mutation) === null || _b === void 0 ? void 0 : _b.type) === "INSERT") {
                        const { data } = body.mutation;
                        const columns = Object.keys(data || {});
                        const values = Object.values(data || {});
                        const placeholders = values.map((_, i) => `$${i + 1}`);
                        const query = `
            INSERT INTO "${tableName}" (${columns.join(", ")})
            VALUES (${placeholders.join(", ")})
            RETURNING *
          `;
                        const result = yield pool.query(query, values);
                        return NextResponse.json(result.rows[0]);
                    }
                    return handleSelect(tableName, body);
                }
                case "PUT": {
                    const { mutation } = body;
                    if (!(mutation === null || mutation === void 0 ? void 0 : mutation.where) || !(mutation === null || mutation === void 0 ? void 0 : mutation.data)) {
                        throw new Error("Update requires where and data");
                    }
                    const setColumns = Object.keys(mutation.data).map((key, i) => `${key} = $${i + 1}`);
                    const whereColumns = Object.keys(mutation.where).map((key, i) => `${key} = $${i + 1 + Object.keys(mutation.data || {}).length}`);
                    const query = `
          UPDATE "${tableName}"
          SET ${setColumns.join(", ")}
          WHERE ${whereColumns.join(" AND ")}
          RETURNING *
        `;
                    const values = [
                        ...Object.values(mutation.data),
                        ...Object.values(mutation.where),
                    ];
                    const result = yield pool.query(query, values);
                    return NextResponse.json(result.rows);
                }
                case "DELETE": {
                    const { mutation } = body;
                    if (!(mutation === null || mutation === void 0 ? void 0 : mutation.where)) {
                        throw new Error("Delete requires where clause");
                    }
                    const whereColumns = Object.keys(mutation.where).map((key, i) => `${key} = $${i + 1}`);
                    const query = `
          DELETE FROM "${tableName}"
          WHERE ${whereColumns.join(" AND ")}
          RETURNING *
        `;
                    const result = yield pool.query(query, Object.values(mutation.where));
                    return NextResponse.json(result.rows);
                }
                default:
                    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
            }
        }
        catch (error) {
            console.error("Database error:", error);
            return NextResponse.json({
                error: error instanceof Error ? error.message : "Unknown error",
                code: error === null || error === void 0 ? void 0 : error.code,
                detail: error === null || error === void 0 ? void 0 : error.detail,
            }, { status: 500 });
        }
    });
}
//# sourceMappingURL=retoolDbHandler.js.map