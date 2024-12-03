import { useCallback, useEffect, useState } from "react";
import type { ZodError } from "zod";
import type {
  RetoolDatabaseConfig,
  RetoolDatabaseError,
  RetoolDatabaseOptions,
} from "../types";

export function useRetoolDatabase<T>(
  tableName: string,
  options?: RetoolDatabaseOptions,
  config: RetoolDatabaseConfig = {},
) {
  const baseUrl = config.baseUrl || "/api/retool-db";
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RetoolDatabaseError | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? { message: err.message }
          : { message: "Unknown error" },
      );
    } finally {
      setIsLoading(false);
    }
  }, [tableName, options, baseUrl]);

  const insert = async (newData: Partial<T>) => {
    if (config.validate) {
      try {
        await config.validate(newData);
      } catch (err) {
        if (err && typeof err === "object" && "errors" in err) {
          throw new Error(
            `Validation error: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`,
          );
        }
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutation: {
            type: "INSERT",
            data: newData,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData((prev) => (prev ? [...prev, result] : [result]));
      return result;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : "Unknown error",
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (where: Partial<T>, updateData: Partial<T>) => {
    if (config.validate) {
      try {
        await config.validate(updateData);
      } catch (err) {
        if (err && typeof err === "object" && "errors" in err) {
          throw new Error(
            `Validation error: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`,
          );
        }
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${tableName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutation: {
            type: "UPDATE",
            where,
            data: updateData,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData((prev) => {
        if (!prev) return result;
        return prev.map((item) => {
          const matches = Object.entries(where).every(
            ([key, value]) => item[key as keyof T] === value,
          );
          return matches ? { ...item, ...updateData } : item;
        });
      });
      return result;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : "Unknown error",
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (where: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${tableName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutation: {
            type: "DELETE",
            where,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData((prev) => {
        if (!prev) return null;
        return prev.filter(
          (item) =>
            !Object.entries(where).every(
              ([key, value]) => item[key as keyof T] === value,
            ),
        );
      });
      return result;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : "Unknown error",
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    insert,
    update,
    remove,
    refetch: fetchData,
  };
}
