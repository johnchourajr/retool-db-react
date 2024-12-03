import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import type { RetoolMutation } from "../types";

export async function retoolDbHandler(
  req: NextRequest,
  { params }: { params: Promise<{ tableName: string }> },
): Promise<Response> {
  const sql = postgres(process.env.RETOOL_DATABASE_URL!);

  try {
    const { tableName } = await params;

    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error("Invalid table name format");
    }

    let body = {};
    const contentType = req.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    }

    const exists = await sql.unsafe(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)",
      [tableName],
    );

    if (!exists[0].exists) {
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
          const placeholders = columns.map((_, i) => `$${i + 1}`);

          const query = `
           INSERT INTO "${tableName}" (${columns.join(", ")})
           VALUES (${placeholders.join(", ")})
           RETURNING *
         `;

          const result = await sql.unsafe(
            query,
            Object.values(data || {}) as any[],
          );
          return NextResponse.json(result[0]);
        }

        // Regular select
        if ((body as any).query) {
          const result = await sql.unsafe(
            (body as any).query,
            (body as any).params || [],
          );
          return NextResponse.json(result);
        }

        const result = await sql.unsafe(
          `SELECT * FROM "${tableName}" LIMIT $1`,
          [(body as any).limit || 100],
        );
        return NextResponse.json(result);
      }

      case "PUT": {
        const { mutation } = body as { mutation: RetoolMutation };
        if (!mutation?.where || !mutation?.data) {
          throw new Error("Update requires where and data");
        }

        const setColumns = Object.entries(mutation.data)
          .map(([key], i) => `${key} = $${i + 1}`)
          .join(", ");

        const whereColumns = Object.entries(mutation.where)
          .map(
            ([key], i) =>
              `${key} = $${i + 1 + Object.keys(mutation.data || {}).length}`,
          )
          .join(" AND ");

        const query = `
         UPDATE "${tableName}"
         SET ${setColumns}
         WHERE ${whereColumns}
         RETURNING *
       `;

        const values = [
          ...Object.values(mutation.data),
          ...Object.values(mutation.where),
        ];
        const result = await sql.unsafe(query, values as any[]);
        return NextResponse.json(result);
      }

      case "DELETE": {
        const { mutation } = body as { mutation: RetoolMutation };
        if (!mutation?.where) {
          throw new Error("Delete requires where clause");
        }

        const whereColumns = Object.entries(mutation.where)
          .map(([key], i) => `${key} = $${i + 1}`)
          .join(" AND ");

        const query = `
         DELETE FROM "${tableName}"
         WHERE ${whereColumns}
         RETURNING *
       `;

        const result = await sql.unsafe(
          query,
          Object.values(mutation.where) as any[],
        );
        return NextResponse.json(result);
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
  } finally {
    await sql.end();
  }
}
