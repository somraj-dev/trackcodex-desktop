#!/usr/bin/env node

/**
 * TrackCodex code-server Launcher
 *
 * Launches a local instance of code-server (VS Code Web) for the IDE integration.
 * Wraps `code-server` with correct configuration for embedding.
 */

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, ".vscode_dev_data");

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log("🚀 Starting TrackCodex IDE Server (code-server)...\n");

const args = [
    "--bind-addr", "127.0.0.1:8080",
    "--auth", "none",                // No password for local dev/iframe
    "--disable-telemetry",
    "--disable-update-check",
    "--user-data-dir", path.join(DATA_DIR, "user-data"),
    "--extensions-dir", path.join(DATA_DIR, "extensions"),
    // Open VSX Configuration via env vars (code-server supports this natively)
    PROJECT_ROOT // Open the project root by default
];

const env = {
    ...process.env,
    // Configure Open VSX
    EXTENSIONS_GALLERY: JSON.stringify({
        serviceUrl: "https://open-vsx.org/vscode/gallery",
        itemUrl: "https://open-vsx.org/vscode/item",
        resourceUrlTemplate: "https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}",
        controlUrl: "",
        recommendationsUrl: ""
    })
};

// Use -y to auto-confirm installation if missing
const server = spawn("npx", ["-y", "code-server", ...args], {
    cwd: PROJECT_ROOT,
    env,
    stdio: "inherit",
    shell: true
});

server.on("close", (code) => {
    console.log(`\ncode-server exited with code ${code}`);
});

process.on("SIGINT", () => {
    server.kill();
    process.exit();
});
