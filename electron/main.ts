import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import net from "net";
import { fileURLToPath } from "url";

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Native check for dev environment
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

// Ensure trackcodex:// protocol is handled
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("trackcodex", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("trackcodex");
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      // Deep link handling for Windows/Linux
      const url = commandLine.pop();
      if (url && url.startsWith("trackcodex://")) {
        handleDeepLink(url);
      }
    }
  });

  // Deep link handling for macOS
  app.on("open-url", (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
  });
}

function handleDeepLink(url: string) {
  const parsedUrl = new URL(url);
  const token = parsedUrl.searchParams.get("token");
  if (token && mainWindow) {
    mainWindow.webContents.send("auth-token", token);
  }
}

// Function to find a free port
const getFreePort = (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        resolve(getFreePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

async function startBackend(): Promise<number> {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(
      '🔧 Dev Mode: Assuming Backend running via "npm run server" on port 4000',
    );
    return 4000;
  }

  // Prod: Spawn bundled backend
  // FORCE Port 3000 for OAuth Redirect Logic
  const port = 3000;

  // Use resourcesPath in production
  const backendPath = path.join(process.resourcesPath, "dist-backend/index.js");
  // Fallback for local testing of "dist"
  const localDistPath = path.join(__dirname, "../dist-backend/index.js");

  const finalBackendPath = app.isPackaged ? backendPath : localDistPath;

  // eslint-disable-next-line no-console
  console.log(`🚀 Spawning Backend on port ${port}...`);
  // eslint-disable-next-line no-console
  console.log(`📂 Path: ${finalBackendPath}`);

  backendProcess = spawn("node", [finalBackendPath], {
    env: {
      ...process.env,
      PORT: port.toString(),
      NODE_ENV: "production",
    },
    stdio: "inherit",
  });

  backendProcess.on("error", (err) => {
    console.error("❌ Failed to start backend:", err);
  });

  return port;
}

async function createWindow() {
  const port = await startBackend();

  process.env.ELECTRON_API_URL = `http://localhost:${port}`;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "TrackCodex Desktop",
    backgroundColor: "#09090b",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  const startUrl = isDev ? "http://localhost:3000" : `http://localhost:${port}`; // In prod, this will be http://localhost:3000 handled by backend

  // eslint-disable-next-line no-console
  console.log(`🌍 Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (backendProcess) {
    // eslint-disable-next-line no-console
    console.log("🛑 Killing Backend Process...");
    backendProcess.kill();
  }
});
