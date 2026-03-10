#!/usr/bin/env node

/**
 * TrackCodex VS Code Web Builder
 *
 * Complete pipeline:
 *   1. Clone VS Code OSS (if not already cloned)
 *   2. Apply TrackCodex branding (product.json → Open VSX gallery)
 *   3. Install VS Code dependencies
 *   4. Compile VS Code Web edition
 *
 * Usage:
 *   node scripts/build-vscode-web.js
 *   node scripts/build-vscode-web.js --skip-clone   (if already cloned)
 */

import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const VSCODE_ROOT = path.join(PROJECT_ROOT, ".vscode_engine");
const PRODUCT_CONFIG = path.join(VSCODE_ROOT, "product.trackcodex.json");
const VSCODE_PRODUCT = path.join(VSCODE_ROOT, "product.json");
const VSCODE_REPO = "https://github.com/nicolo-ribaudo/tc39-proposal-await-dictionary.git";
const VSCODE_TAG = "1.96.0"; // Pin to a stable release

const skipClone = process.argv.includes("--skip-clone");

console.log("🚀 TrackCodex VS Code Web Builder\n");

// ─── Step 1: Clone VS Code OSS ─────────────────────────────
function isVSCodeCloned() {
  // Check for package.json as indicator of a real VS Code clone
  return fs.existsSync(path.join(VSCODE_ROOT, "package.json"));
}

async function cloneVSCode() {
  if (isVSCodeCloned()) {
    console.log("✅ VS Code source already cloned\n");
    return;
  }

  if (skipClone) {
    console.error("❌ VS Code source not found and --skip-clone was specified");
    process.exit(1);
  }

  console.log("📥 Cloning VS Code OSS (this takes 2-5 minutes)...");
  console.log("   Repository: https://github.com/microsoft/vscode.git");
  console.log(`   Tag: ${VSCODE_TAG}\n`);

  // Ensure .vscode_engine dir exists (preserve product.trackcodex.json)
  if (!fs.existsSync(VSCODE_ROOT)) {
    fs.mkdirSync(VSCODE_ROOT, { recursive: true });
  }

  // Save product.trackcodex.json if it exists before clone overwrites dir
  let savedConfig = null;
  if (fs.existsSync(PRODUCT_CONFIG)) {
    savedConfig = fs.readFileSync(PRODUCT_CONFIG, "utf-8");
  }

  try {
    // Shallow clone of specific tag for speed
    execSync(
      `git clone --depth 1 --branch ${VSCODE_TAG} https://github.com/microsoft/vscode.git "${VSCODE_ROOT}_tmp"`,
      { stdio: "inherit" }
    );

    // Move contents from temp to .vscode_engine (preserving existing files)
    const tmpDir = `${VSCODE_ROOT}_tmp`;
    const files = fs.readdirSync(tmpDir);
    for (const file of files) {
      const src = path.join(tmpDir, file);
      const dest = path.join(VSCODE_ROOT, file);
      if (!fs.existsSync(dest)) {
        fs.renameSync(src, dest);
      }
    }
    // Clean up temp
    fs.rmSync(tmpDir, { recursive: true, force: true });

    // Restore product.trackcodex.json
    if (savedConfig) {
      fs.writeFileSync(PRODUCT_CONFIG, savedConfig);
    }

    console.log("\n✅ VS Code OSS cloned successfully\n");
  } catch (err) {
    console.error("\n❌ Failed to clone VS Code OSS");
    console.error("   Make sure git is installed and you have internet access.");
    console.error("   You can also clone manually:");
    console.error(
      `   git clone --depth 1 --branch ${VSCODE_TAG} https://github.com/microsoft/vscode.git .vscode_engine`
    );
    process.exit(1);
  }
}

// ─── Step 2: Apply TrackCodex Branding ──────────────────────
function applyBranding() {
  console.log("📝 Applying TrackCodex branding...");

  // Ensure product.trackcodex.json exists
  if (!fs.existsSync(PRODUCT_CONFIG)) {
    console.log("   Creating default product.trackcodex.json...");
    const defaultConfig = {
      nameShort: "TrackCodex IDE",
      nameLong: "TrackCodex IDE - Powered by VS Code OSS",
      applicationName: "trackcodex-ide",
      dataFolderName: ".trackcodex-ide",
      extensionsGallery: {
        serviceUrl: "https://open-vsx.org/vscode/gallery",
        itemUrl: "https://open-vsx.org/vscode/item",
        resourceUrlTemplate:
          "https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}",
      },
      linkProtectionTrustedDomains: [
        "https://open-vsx.org",
        "https://*.open-vsx.org",
      ],
    };
    fs.writeFileSync(PRODUCT_CONFIG, JSON.stringify(defaultConfig, null, 2));
  }

  // Backup original product.json (if it exists and hasn't been backed up)
  const productBackup = VSCODE_PRODUCT + ".original";
  if (fs.existsSync(VSCODE_PRODUCT) && !fs.existsSync(productBackup)) {
    fs.copyFileSync(VSCODE_PRODUCT, productBackup);
    console.log("   Backed up original product.json");
  }

  // Apply TrackCodex config
  if (fs.existsSync(VSCODE_PRODUCT)) {
    // Merge TrackCodex config with original product.json
    const original = JSON.parse(fs.readFileSync(VSCODE_PRODUCT, "utf-8"));
    const trackcodex = JSON.parse(fs.readFileSync(PRODUCT_CONFIG, "utf-8"));
    const merged = { ...original, ...trackcodex };
    fs.writeFileSync(VSCODE_PRODUCT, JSON.stringify(merged, null, 2));
  } else {
    // No product.json yet — just copy our config
    fs.copyFileSync(PRODUCT_CONFIG, VSCODE_PRODUCT);
  }

  console.log("✅ TrackCodex branding applied\n");
}

// ─── Step 3: Install Dependencies ───────────────────────────
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log("📦 Installing VS Code dependencies...");
    console.log("   This may take 5-10 minutes on first run...\n");

    const proc = spawn("npm", ["install"], {
      cwd: VSCODE_ROOT,
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`npm install failed with code: ${code}`));
        return;
      }
      console.log("\n✅ Dependencies installed\n");
      resolve();
    });
  });
}

// ─── Step 4: Compile VS Code Web ────────────────────────────
function compileWeb() {
  return new Promise((resolve, reject) => {
    console.log("🔨 Compiling VS Code Web...");
    console.log("   This build takes 10-30 minutes on first run...");
    console.log("   Subsequent builds will be much faster.\n");

    const proc = spawn("npm", ["run", "compile-web"], {
      cwd: VSCODE_ROOT,
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`VS Code Web compilation failed with code: ${code}`));
        return;
      }
      console.log("\n✅ VS Code Web compiled successfully!\n");
      console.log(
        "📦 Output location:",
        path.join(VSCODE_ROOT, "out-vscode-web")
      );
      console.log("\n🎉 Setup complete! You can now run:");
      console.log("   npm run serve:vscode");
      console.log("   npm run dev\n");
      resolve();
    });
  });
}

// ─── Run Pipeline ───────────────────────────────────────────
async function main() {
  try {
    await cloneVSCode();
    applyBranding();
    await installDependencies();
    await compileWeb();
  } catch (err) {
    console.error("\n❌ Build failed:", err.message);
    process.exit(1);
  }
}

main();
