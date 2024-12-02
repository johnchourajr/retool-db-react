"use client";

import { Buen_table } from "@/types/buen_table";
import { useRetoolDatabase } from "@muybuen/retool-db-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { SliceWrapper } from "../SliceWrapper";

export function DatabaseList({ data: initialData }: { data?: any }) {
  const { data, isLoading, insert, remove } = useRetoolDatabase("buen_table");

  const items: Buen_table[] = data || initialData;

  const addItem = async () => {
    await insert({ value: null });
  };

  const removeItem = async (id: number) => {
    await remove({ id });
  };

  return (
    <SliceWrapper>
      <div className="col-span-full flex flex-col pt-56 md:pt-0">
        <p
          className={clsx(
            "headline-display-xxl mb-10 ml-[-0.05em] mt-[-0.06em] transition-opacity pointer-events-none",
            isLoading && "opacity-5",
          )}
        >
          {items?.length || 0}
        </p>
        <p className="text-string mb-4">
          Items in Retool Database{" "}
          {!!isLoading && (
            <motion.span className="text-string opacity-50" layout>
              Refreshing...
            </motion.span>
          )}
        </p>
        <p className="mb-2 max-w-80">
          Add or remove items from the database to test the reactivity of the
          hook.
        </p>
        <div className="flex flex-wrap gap-2 py-10">
          <button
            onClick={addItem}
            className="px-3 pb-2 pt-1.5 border-1 rounded-md border-primary inline grow-0 w-fit !lowercase text-body"
          >
            + Add item
          </button>
          <button
            onClick={() => removeItem(items[0].id)}
            className="px-3 pb-2 pt-1.5 border-1 rounded-md border-primary inline grow-0 w-fit !lowercase text-body"
          >
            - Remove item
          </button>
        </div>
      </div>
    </SliceWrapper>
  );
}
