// app/api/retool-db/[tableName]/route.ts
import { retoolDbHandler } from "@muybuen/retool-db-react/server";
import { NextRequest } from "next/server";

type RouteContext = { params: { tableName: string } };

export async function handler(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  return retoolDbHandler(request, { params });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
