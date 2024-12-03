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
    external: ["react", "react-dom", "next"],
    outDir: "dist",
    sourcemap: true,
    platform: "node",
    noExternal: ["events", "postgres"],
  },
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    dts: true,
    external: ["arg", "fs", "path"],
    outDir: "dist",
    sourcemap: true,
    platform: "node",
    noExternal: ["events", "postgres"],
    banner: { js: "#!/usr/bin/env node" },
    esbuildOptions: (options) => {
      options.charset = "utf8";
    },
  },
]);
