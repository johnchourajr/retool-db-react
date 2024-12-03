var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/hooks/useRetoolDatabase.ts
import { useCallback, useEffect, useState } from "react";
function useRetoolDatabase(tableName, options, config = {}) {
  const baseUrl = config.baseUrl || "/api/retool-db";
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(() => __async(this, null, function* () {
    setIsLoading(true);
    setError(null);
    try {
      const res = yield fetch(`${baseUrl}/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {})
      });
      const result = yield res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? { message: err.message } : { message: "Unknown error" }
      );
    } finally {
      setIsLoading(false);
    }
  }), [tableName, options, baseUrl]);
  const insert = (newData) => __async(this, null, function* () {
    if (config.validate) {
      try {
        yield config.validate(newData);
      } catch (err) {
        if (err && typeof err === "object" && "errors" in err) {
          throw new Error(
            `Validation error: ${err.errors.map((e) => e.message).join(", ")}`
          );
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
            data: newData
          }
        })
      });
      const result = yield res.json();
      if (!res.ok) throw new Error(result.error);
      setData((prev) => prev ? [...prev, result] : [result]);
      return result;
    } catch (err) {
      const error2 = {
        message: err instanceof Error ? err.message : "Unknown error"
      };
      setError(error2);
      throw error2;
    } finally {
      setIsLoading(false);
    }
  });
  const update = (where, updateData) => __async(this, null, function* () {
    if (config.validate) {
      try {
        yield config.validate(updateData);
      } catch (err) {
        if (err && typeof err === "object" && "errors" in err) {
          throw new Error(
            `Validation error: ${err.errors.map((e) => e.message).join(", ")}`
          );
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
            data: updateData
          }
        })
      });
      const result = yield res.json();
      if (!res.ok) throw new Error(result.error);
      setData((prev) => {
        if (!prev) return result;
        return prev.map((item) => {
          const matches = Object.entries(where).every(
            ([key, value]) => item[key] === value
          );
          return matches ? __spreadValues(__spreadValues({}, item), updateData) : item;
        });
      });
      return result;
    } catch (err) {
      const error2 = {
        message: err instanceof Error ? err.message : "Unknown error"
      };
      setError(error2);
      throw error2;
    } finally {
      setIsLoading(false);
    }
  });
  const remove = (where) => __async(this, null, function* () {
    setIsLoading(true);
    setError(null);
    try {
      const res = yield fetch(`${baseUrl}/${tableName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutation: {
            type: "DELETE",
            where
          }
        })
      });
      const result = yield res.json();
      if (!res.ok) throw new Error(result.error);
      setData((prev) => {
        if (!prev) return null;
        return prev.filter(
          (item) => !Object.entries(where).every(
            ([key, value]) => item[key] === value
          )
        );
      });
      return result;
    } catch (err) {
      const error2 = {
        message: err instanceof Error ? err.message : "Unknown error"
      };
      setError(error2);
      throw error2;
    } finally {
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
    refetch: fetchData
  };
}
export {
  useRetoolDatabase
};
//# sourceMappingURL=client.mjs.map