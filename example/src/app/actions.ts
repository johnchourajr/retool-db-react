"use server";

import { queryRetoolDatabase } from "@muybuen/retool-db-react/server";

export async function getInitialData() {
  const initialTableData = await queryRetoolDatabase("buen_table");
  const initialBuenNumber = await queryRetoolDatabase("buen_number");

  return await {
    initialTableData,
    initialBuenNumber,
  };
}
