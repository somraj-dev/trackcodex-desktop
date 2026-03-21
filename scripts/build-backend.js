import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("📦 Bundling Backend...");

esbuild
  .build({
    entryPoints: [path.join(__dirname, "../backend/server.ts")],
    bundle: true,
    platform: "node",
    target: "node18",
    outfile: path.join(__dirname, "../dist-backend/index.js"),
    // Explicitly externalize only native modules or large binary dependencies
    // Also externalize Node.js built-ins to avoid bundling issues in ESM
    external: [
      "@prisma/client",
      "bcrypt",
      "fs",
      "path",
      "os",
      "crypto",
      "events",
      "http",
      "https",
      "net",
      "stream",
      "url",
      "util",
      "zlib"
    ],
    sourcemap: true,
    format: "esm",
    banner: {
      js: `
import { createRequire as __topLevelCreateRequire } from 'module';
import { fileURLToPath as __topLevelFileURLToPath } from 'url';
import { dirname as __topLevelDirname } from 'path';
const require = __topLevelCreateRequire(import.meta.url);
const __filename = __topLevelFileURLToPath(import.meta.url);
const __dirname = __topLevelDirname(__filename);
`.trim(),
    },
  })
  .then(() => {
    console.log("✅ Backend bundled successfully to dist-backend/index.js");
  })
  .catch(() => {
    console.error("❌ Backend build failed");
    process.exit(1);
  });
