"use client";

import { Buen_number } from "@/types/buen_number";
import { useRetoolDatabase } from "@muybuen/retool-db-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { SliceWrapper } from "../SliceWrapper";

export function DatabaseNumber({ data: initialData }: { data: any }) {
  const { data, isLoading, update } = useRetoolDatabase("buen_number");

  const items: Buen_number[] = data || initialData;
  const total = items[0]?.total || 0;

  const incrementTotal = async () => {
    await update({ id: items[0].id }, { total: (total || 0) + 1 });
  };

  const decrementTotal = async () => {
    await update({ id: items[0].id }, { total: Math.max(0, (total || 0) - 1) });
  };

  return (
    <SliceWrapper>
      <div className="col-span-full flex flex-col">
        <p
          className={clsx(
            "relative headline-display-xxl mb-10 ml-[-0.05em] mt-[-0.06em] transition-opacity pointer-events-none",
            isLoading && "opacity-5",
          )}
        >
          {total}
        </p>
        <p className="text-string mb-4">
          Total value in database{" "}
          {!!isLoading && (
            <motion.span className="text-string opacity-50" layout>
              Refreshing...
            </motion.span>
          )}
        </p>
        <p className="mb-2 max-w-80">
          Increment or decrement the total value stored in the database.
        </p>

        <div className="flex flex-wrap gap-2 py-10">
          <button
            onClick={incrementTotal}
            className="px-3 pb-2 pt-1.5 border-1 rounded-md border-primary inline grow-0 w-fit !lowercase text-body"
          >
            + Increment
          </button>
          <button
            onClick={decrementTotal}
            className="px-3 pb-2 pt-1.5 border-1 rounded-md border-primary inline grow-0 w-fit !lowercase text-body"
          >
            - Decrement
          </button>
        </div>
      </div>
    </SliceWrapper>
  );
}
