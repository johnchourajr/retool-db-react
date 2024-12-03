// app/api/retool-db/[tableName]/route.ts
// import { retoolDbHandler } from "../../../../../../src/lib/retoolDbHandler";
import { retoolDbHandler } from "@muybuen/retool-db-react/server";

export const GET = retoolDbHandler;
export const POST = retoolDbHandler;
export const PUT = retoolDbHandler;
export const DELETE = retoolDbHandler;
