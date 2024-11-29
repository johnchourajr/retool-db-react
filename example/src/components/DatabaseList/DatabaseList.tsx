"use client";

// import { useRetoolDatabase } from "@muybuen/retool-db-react";

import { useRetoolDatabase } from "../../../../src/hooks/useRetoolDatabase";

export function DatabaseList({ data: initialData }: { data: any }) {
  const { data, isLoading, insert } = useRetoolDatabase("buen_table");

  const items = data || initialData;

  const addItem = async () => {
    await insert({ value: null });
  };

  return (
    <div>
      <p>Number of items: {items?.length}</p>
      <button onClick={addItem}>Add item</button>
      {isLoading ? "Refreshing..." : null}
    </div>
  );
}
