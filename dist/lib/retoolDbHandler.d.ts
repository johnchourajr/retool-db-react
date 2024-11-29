import { NextRequest, NextResponse } from "next/server";
export declare function retoolDbHandler(req: NextRequest, { params }: {
    params: {
        tableName: string;
    };
}): Promise<NextResponse<any>>;
