// app/api/retool-db/[tableName]/route.ts
import { retoolDbHandler } from "@muybuen/retool-db-react/server";
// import { retoolDbHandler } from "../../../../../../src/lib/retoolDbHandler";

export const GET = retoolDbHandler;
export const POST = retoolDbHandler;
export const PUT = retoolDbHandler;
export const DELETE = retoolDbHandler;
