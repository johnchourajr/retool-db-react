"use client";

import { Buen_table } from "@/types/buen_table";
import { useRetoolDatabase } from "@muybuen/retool-db-react";

export function DatabaseList({ data: initialData }: { data: any }) {
  const { data, isLoading, insert, remove } = useRetoolDatabase("buen_table");

  const items: Buen_table[] = data || initialData;

  const addItem = async () => {
    await insert({ value: null });
  };

  const removeItem = async (id: number) => {
    await remove(id);
  };

  return (
    <div>
      <p className="headline-display-xxl leading-none mb-2">{items?.length}</p>
      <p className="text-string">Items in db</p>
      <button onClick={addItem}>Add item</button>
      <button onClick={() => removeItem(items[0].id)}>Remove item</button>
      {isLoading ? "Refreshing..." : null}
    </div>
  );
}
