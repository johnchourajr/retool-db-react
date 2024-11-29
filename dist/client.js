"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/client.ts
var client_exports = {};
__export(client_exports, {
  useRetoolDatabase: () => useRetoolDatabase
});
module.exports = __toCommonJS(client_exports);

// src/hooks/useRetoolDatabase.ts
var import_react = require("react");
var import_zod = require("zod");
function useRetoolDatabase(tableName, options, config = {}) {
  const baseUrl = config.baseUrl || "/api/retool-db";
  const [data, setData] = (0, import_react.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const [schema, setSchema] = (0, import_react.useState)(null);
  const fetchData = (0, import_react.useCallback)(() => __async(this, null, function* () {
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
    if (schema) {
      try {
        schema.partial().parse(newData);
      } catch (err) {
        if (err instanceof import_zod.z.ZodError) {
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
    if (schema) {
      try {
        schema.partial().parse(updateData);
      } catch (err) {
        if (err instanceof import_zod.z.ZodError) {
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
  (0, import_react.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRetoolDatabase
});
//# sourceMappingURL=client.js.map