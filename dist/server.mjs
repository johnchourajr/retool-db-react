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

// src/server.ts
import { Pool } from "pg";
function queryRetoolDatabase(tableName, options) {
  return __async(this, null, function* () {
    const pool = new Pool({
      connectionString: process.env.RETOOL_DATABASE_URL
    });
    try {
      if (options == null ? void 0 : options.query) {
        const result2 = yield pool.query({
          text: options.query,
          values: options.params || []
        });
        return result2.rows;
      }
      const result = yield pool.query({
        text: `SELECT * FROM "${tableName}" LIMIT $1`,
        values: [(options == null ? void 0 : options.limit) || 100]
      });
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      yield pool.end();
    }
  });
}
export {
  queryRetoolDatabase
};
//# sourceMappingURL=server.mjs.map