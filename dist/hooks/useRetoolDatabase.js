var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
export function useRetoolDatabase(tableName, options, config = {}) {
    const baseUrl = config.baseUrl || "/api/retool-db";
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [schema, setSchema] = useState(null);
    const fetchData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const res = yield fetch(`${baseUrl}/${tableName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options || {}),
            });
            const result = yield res.json();
            if (!res.ok)
                throw new Error(result.error);
            setData(result);
        }
        catch (err) {
            setError(err instanceof Error
                ? { message: err.message }
                : { message: "Unknown error" });
        }
        finally {
            setIsLoading(false);
        }
    }), [tableName, options, baseUrl]);
    const insert = (newData) => __awaiter(this, void 0, void 0, function* () {
        if (schema) {
            try {
                schema.partial().parse(newData);
            }
            catch (err) {
                if (err instanceof z.ZodError) {
                    throw new Error(`Validation error: ${err.errors.map((e) => e.message).join(", ")}`);
                }
            }
        }
        setIsLoading(true);
        setError(null);
        try {
            const res = yield fetch(`${baseUrl}/${tableName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mutation: {
                        type: "INSERT",
                        data: newData,
                    },
                }),
            });
            const result = yield res.json();
            if (!res.ok)
                throw new Error(result.error);
            setData((prev) => (prev ? [...prev, result] : [result]));
            return result;
        }
        catch (err) {
            const error = {
                message: err instanceof Error ? err.message : "Unknown error",
            };
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    });
    const update = (where, updateData) => __awaiter(this, void 0, void 0, function* () {
        if (schema) {
            try {
                schema.partial().parse(updateData);
            }
            catch (err) {
                if (err instanceof z.ZodError) {
                    throw new Error(`Validation error: ${err.errors.map((e) => e.message).join(", ")}`);
                }
            }
        }
        setIsLoading(true);
        setError(null);
        try {
            const res = yield fetch(`${baseUrl}/${tableName}`, {
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
            const result = yield res.json();
            if (!res.ok)
                throw new Error(result.error);
            setData((prev) => {
                if (!prev)
                    return result;
                return prev.map((item) => {
                    const matches = Object.entries(where).every(([key, value]) => item[key] === value);
                    return matches ? Object.assign(Object.assign({}, item), updateData) : item;
                });
            });
            return result;
        }
        catch (err) {
            const error = {
                message: err instanceof Error ? err.message : "Unknown error",
            };
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    });
    const remove = (where) => __awaiter(this, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const res = yield fetch(`${baseUrl}/${tableName}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mutation: {
                        type: "DELETE",
                        where,
                    },
                }),
            });
            const result = yield res.json();
            if (!res.ok)
                throw new Error(result.error);
            setData((prev) => {
                if (!prev)
                    return null;
                return prev.filter((item) => !Object.entries(where).every(([key, value]) => item[key] === value));
            });
            return result;
        }
        catch (err) {
            const error = {
                message: err instanceof Error ? err.message : "Unknown error",
            };
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    });
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
//# sourceMappingURL=useRetoolDatabase.js.map