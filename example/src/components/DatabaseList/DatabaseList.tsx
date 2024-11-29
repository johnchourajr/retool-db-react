"use client";

import { useRetoolDatabase } from "../../../../src/hooks/useRetoolDatabase";

export function DatabaseList() {
  const { data, insert } = useRetoolDatabase("buen_table");

  const addItem = async () => {
    await insert({ value: null });
  };

  return (
    <div>
      <p>Number of items: {data?.length}</p>
      <button onClick={addItem}>Add item</button>
    </div>
  );
}
