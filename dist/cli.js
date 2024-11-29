var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command } from "commander";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { Pool } from "pg";
import { generateTableTypes } from "./lib/schemaGenerator";
const program = new Command();
program
    .name("retool-db-types")
    .description("Generate TypeScript types from your Retool database")
    .option("-u, --url <url>", "Database connection URL")
    .option("-o, --output <path>", "Output directory", "./src/types")
    .option("-t, --table <table>", "Specific table to generate types for")
    .parse(process.argv);
const options = program.opts();
function generateTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.url) {
            console.error("Error: Database URL is required");
            process.exit(1);
        }
        const pool = new Pool({
            connectionString: options.url,
        });
        try {
            // Create output directory if it doesn't exist
            mkdirSync(options.output, { recursive: true });
            if (options.table) {
                // Generate types for specific table
                const tableType = yield generateTableTypes(options.table, pool);
                const outputPath = path.join(options.output, `${options.table}.ts`);
                writeFileSync(outputPath, tableType);
                console.log(`Types generated for table ${options.table}`);
            }
            else {
                // Generate types for all tables
                const tableQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
      `;
                const tables = yield pool.query(tableQuery);
                let typesContent = "// Generated by retool-db-types\n\n";
                for (const { table_name } of tables.rows) {
                    const tableType = yield generateTableTypes(table_name, pool);
                    typesContent += tableType + "\n\n";
                }
                const outputPath = path.join(options.output, "index.ts");
                writeFileSync(outputPath, typesContent);
                console.log("Types generated for all tables!");
            }
        }
        catch (error) {
            console.error("Error generating types:", error);
            process.exit(1);
        }
        finally {
            yield pool.end();
        }
    });
}
generateTypes();
//# sourceMappingURL=cli.js.map