"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var server_exports = {};
__export(server_exports, {
  queryRetoolDatabase: () => queryRetoolDatabase,
  retoolDbHandler: () => retoolDbHandler
});
module.exports = __toCommonJS(server_exports);

// src/lib/retoolDbHandler.ts
var import_server = require("next/server");
var import_pg = require("pg");
var pool = new import_pg.Pool({
  connectionString: process.env.RETOOL_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 2e3
});
function handleSelect(tableName, body) {
  return __async(this, null, function* () {
    if (body.query) {
      const result2 = yield pool.query({
        text: body.query,
        values: body.params || []
      });
      return import_server.NextResponse.json(result2.rows);
    }
    const result = yield pool.query({
      text: `SELECT * FROM "${tableName}" LIMIT $1`,
      values: [body.limit || 100]
    });
    return import_server.NextResponse.json(result.rows);
  });
}
function retoolDbHandler(req, context) {
  return __async(this, null, function* () {
    var _a;
    if (!["GET", "POST", "PUT", "DELETE"].includes(req.method || "")) {
      return import_server.NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const { tableName } = "then" in context.params ? yield context.params : context.params;
    try {
      if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        throw new Error("Invalid table name format");
      }
      let body = {};
      const contentType = req.headers.get("content-type");
      if (contentType == null ? void 0 : contentType.includes("application/json")) {
        try {
          const text = yield req.text();
          body = text ? JSON.parse(text) : {};
        } catch (e) {
          console.warn("Failed to parse JSON body:", e);
        }
      }
      const tableExists = yield pool.query(
        `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = $1
      )
    `,
        [tableName]
      );
      if (!tableExists.rows[0].exists) {
        return import_server.NextResponse.json(
          { error: `Table '${tableName}' does not exist` },
          { status: 404 }
        );
      }
      switch (req.method) {
        case "POST": {
          if (((_a = body.mutation) == null ? void 0 : _a.type) === "INSERT") {
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
            return import_server.NextResponse.json(result.rows[0]);
          }
          return handleSelect(tableName, body);
        }
        case "PUT": {
          const { mutation } = body;
          if (!(mutation == null ? void 0 : mutation.where) || !(mutation == null ? void 0 : mutation.data)) {
            throw new Error("Update requires where and data");
          }
          const setColumns = Object.keys(mutation.data).map(
            (key, i) => `${key} = $${i + 1}`
          );
          const whereColumns = Object.keys(mutation.where).map(
            (key, i) => `${key} = $${i + 1 + Object.keys(mutation.data || {}).length}`
          );
          const query = `
          UPDATE "${tableName}"
          SET ${setColumns.join(", ")}
          WHERE ${whereColumns.join(" AND ")}
          RETURNING *
        `;
          const values = [
            ...Object.values(mutation.data),
            ...Object.values(mutation.where)
          ];
          const result = yield pool.query(query, values);
          return import_server.NextResponse.json(result.rows);
        }
        case "DELETE": {
          const { mutation } = body;
          if (!(mutation == null ? void 0 : mutation.where)) {
            throw new Error("Delete requires where clause");
          }
          const whereColumns = Object.keys(mutation.where).map(
            (key, i) => `${key} = $${i + 1}`
          );
          const query = `
          DELETE FROM "${tableName}"
          WHERE ${whereColumns.join(" AND ")}
          RETURNING *
        `;
          const result = yield pool.query(query, Object.values(mutation.where));
          return import_server.NextResponse.json(result.rows);
        }
        default:
          return import_server.NextResponse.json(
            { error: "Method not allowed" },
            { status: 405 }
          );
      }
    } catch (error) {
      console.error("Database error:", error);
      return import_server.NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
          code: error == null ? void 0 : error.code,
          detail: error == null ? void 0 : error.detail
        },
        { status: 500 }
      );
    }
  });
}

// src/lib/queryRetoolDatabase.ts
var import_pg2 = require("pg");
function queryRetoolDatabase(tableName, options) {
  return __async(this, null, function* () {
    const pool2 = new import_pg2.Pool({
      connectionString: process.env.RETOOL_DATABASE_URL
    });
    try {
      if (options == null ? void 0 : options.query) {
        const result2 = yield pool2.query({
          text: options.query,
          values: options.params || []
        });
        return result2.rows;
      }
      const result = yield pool2.query({
        text: `SELECT * FROM "${tableName}" LIMIT $1`,
        values: [(options == null ? void 0 : options.limit) || 100]
      });
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      yield pool2.end();
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  queryRetoolDatabase,
  retoolDbHandler
});
//# sourceMappingURL=server.js.map