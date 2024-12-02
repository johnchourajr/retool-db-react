// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/client.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    external: ["react", "react-dom", "next"],
    outDir: "dist",
    sourcemap: true,
    noExternal: ["events"],
  },
  {
    entry: ["src/server.ts"],
    format: ["esm", "cjs"],
    dts: true,
    external: ["pg", "react", "react-dom", "next"],
    outDir: "dist",
    sourcemap: true,
    platform: "node",
    noExternal: ["events"],
  },
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    dts: true,
    external: ["commander", "fs", "path"],
    outDir: "dist",
    sourcemap: true,
    platform: "node",
    noExternal: ["events", "pg"],
    banner: { js: "#!/usr/bin/env node" },
    esbuildOptions: (options) => {
      options.charset = "utf8";
    },
  },
]);
