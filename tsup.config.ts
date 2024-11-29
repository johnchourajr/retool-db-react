// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig([
  {
    // Client bundle (includes hooks and client files)
    entry: ["src/client.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    external: ["react", "react-dom", "next"],
    outDir: "dist",
    sourcemap: true,
  },
  {
    // Server bundle (includes server utilities)
    entry: ["src/server.ts"],
    format: ["esm", "cjs"],
    dts: true,
    external: ["pg"],
    outDir: "dist",
    sourcemap: true,
    platform: "node",
  },
  {
    // CLI bundle
    entry: ["src/cli.ts"],
    format: ["cjs"],
    dts: true,
    external: ["pg"],
    outDir: "dist",
    sourcemap: true,
    platform: "node",
  },
]);
