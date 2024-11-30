import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { RetoolMutation } from "../types";

const pool = new Pool({
  connectionString: process.env.RETOOL_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function handleSelect(tableName: string, body: any) {
  if (body.query) {
    const result = await pool.query({
      text: body.query,
      values: body.params || [],
    });
    return NextResponse.json(result.rows);
  }

  const result = await pool.query({
    text: `SELECT * FROM "${tableName}" LIMIT $1`,
    values: [body.limit || 100],
  });
  return NextResponse.json(result.rows);
}

export async function retoolDbHandler(
  req: NextRequest,
  context: { params: { tableName: string } | Promise<{ tableName: string }> },
) {
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method || "")) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { tableName } =
    "then" in context.params ? await context.params : context.params;

  try {
    // Validate table name format
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error("Invalid table name format");
    }

    // Get request body with default empty object
    let body = {};
    const contentType = req.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        const text = await req.text();
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Failed to parse JSON body:", e);
      }
    }

    // Verify table exists
    const tableExists = await pool.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = $1
      )
    `,
      [tableName],
    );

    if (!tableExists.rows[0].exists) {
      return NextResponse.json(
        { error: `Table '${tableName}' does not exist` },
        { status: 404 },
      );
    }

    switch (req.method) {
      case "POST": {
        if (
          (body as { mutation?: RetoolMutation }).mutation?.type === "INSERT"
        ) {
          const { data } = (body as { mutation: RetoolMutation }).mutation;
          const columns = Object.keys(data || {});
          const values = Object.values(data || {});
          const placeholders = values.map((_, i) => `$${i + 1}`);

          const query = `
            INSERT INTO "${tableName}" (${columns.join(", ")})
            VALUES (${placeholders.join(", ")})
            RETURNING *
          `;

          const result = await pool.query(query, values);
          return NextResponse.json(result.rows[0]);
        }

        return handleSelect(tableName, body);
      }

      case "PUT": {
        const { mutation } = body as { mutation: RetoolMutation };
        if (!mutation?.where || !mutation?.data) {
          throw new Error("Update requires where and data");
        }

        const setColumns = Object.keys(mutation.data).map(
          (key, i) => `${key} = $${i + 1}`,
        );
        const whereColumns = Object.keys(mutation.where).map(
          (key, i) =>
            `${key} = $${i + 1 + Object.keys(mutation.data || {}).length}`,
        );

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

        const result = await pool.query(query, values);
        return NextResponse.json(result.rows);
      }

      case "DELETE": {
        const { mutation } = body as { mutation: RetoolMutation };
        if (!mutation?.where) {
          throw new Error("Delete requires where clause");
        }

        const whereColumns = Object.keys(mutation.where).map(
          (key, i) => `${key} = $${i + 1}`,
        );

        const query = `
          DELETE FROM "${tableName}"
          WHERE ${whereColumns.join(" AND ")}
        `;

        const result = await pool.query(query, Object.values(mutation.where));
        return NextResponse.json(result.rows);
      }

      default:
        return NextResponse.json(
          { error: "Method not allowed" },
          { status: 405 },
        );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code,
        detail: (error as any)?.detail,
      },
      { status: 500 },
    );
  }
}
