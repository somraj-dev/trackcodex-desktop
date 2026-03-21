const { app, BrowserWindow, ipcMain, utilityProcess } = require("electron");
import path from "path";
import Store from "electron-store";

// Set app name and initialize Store early
if (app) {
  app.setName("trackcodex");
  Store.initRenderer();
}

import { fileURLToPath } from "url";

import { authManager } from "./auth-manager";
import { TrayManager } from "./tray-manager";
import { NotificationManager } from "./notification-manager";
import { UpdateManager } from "./update-manager";

// ESM/CJS compatibility shims for _dirname and _filename
const isESM = typeof import.meta.url !== 'undefined';
const _filename = isESM ? fileURLToPath(import.meta.url) : path.resolve((global as any).__filename || "");
const _dirname = path.dirname(_filename);

// Native check for dev environment
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let backendProcess: any = null; // utilityProcess.fork returns a UtilityProcess
let trayManager: TrayManager | null = null;
let notificationManager: NotificationManager | null = null;
let updateManager: UpdateManager | null = null;

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
  app.on("second-instance", (event, commandLine) => {
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
  
  // TrackCodex digital handshake callback
  if (token && (parsedUrl.pathname === "//auth/callback" || parsedUrl.hostname === "auth" || url.includes("auth/callback"))) {
    // We received the one-time token from the browser.
    // Exchange it via the backend API.
    authManager.exchangeHandshakeToken(token)
      .then(({ sessionId }) => {
        console.log("Handshake successful, session created.");
        if (mainWindow) {
          mainWindow.webContents.send("auth-success", sessionId);
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.show();
          mainWindow.focus();
        }
      })
      .catch((err) => {
        console.error("Failed to exchange token from deep link:", err);
      });
  } else if (token && mainWindow) {
    // Legacy support
    mainWindow.webContents.send("auth-token", token);
  }
}

// Auth Manager IPC Handlers
ipcMain.on("auth-get-token", (event) => {
  event.returnValue = authManager.getToken();
});

ipcMain.on("auth-set-token", (event, token) => {
  authManager.setToken(token);
});

ipcMain.on("auth-clear-token", () => {
  authManager.clearToken();
});

ipcMain.handle("auth-initiate-handshake", async () => {
  return await authManager.initiateHandshake();
});

// Function to find a free port
// UNUSED but kept for potential future dynamic port allocation
/*
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
*/

async function startBackend(): Promise<number> {
  if (isDev) {
    console.warn('🔧 Dev Mode: Assuming Backend running via "npm run server" on port 4000');
    return 4000;
  }

  // Prod: Spawn bundled backend using utilityProcess
  const port = 3000;

  // Paths for packaged app
  const resourcesPath = process.resourcesPath;
  const backendPath = path.join(resourcesPath, "dist-backend/index.js");
  const schemaPath = path.join(resourcesPath, "backend/schema.prisma");
  const enginePath = path.join(resourcesPath, "query_engine-windows.dll.node");

  // Fallback for local testing of "dist" structure outside of .exe
  const localDistPath = path.join(_dirname, "../dist-backend/index.js");
  const finalBackendPath = app.isPackaged ? backendPath : localDistPath;

  console.warn(`🚀 Forking Backend on port ${port}...`);
  console.warn(`📂 Backend Path: ${finalBackendPath}`);
  console.warn(`📄 Schema Path: ${schemaPath}`);

  // Use utilityProcess.fork() for robust background execution using Electron's Node runtime
  backendProcess = (utilityProcess as any).fork(finalBackendPath, [], {
    env: {
      ...process.env,
      PORT: port.toString(),
      NODE_ENV: "production",
      DATABASE_URL: process.env.DATABASE_URL || "",
      // PRISMA configuration for production
      PRISMA_QUERY_ENGINE_LIBRARY: enginePath,
      PRISMA_SCHEMA_ENGINE_BINARY: schemaPath,
    },
    stdio: "inherit",
  });

  backendProcess.on("exit", (code: number) => {
    console.warn(`🛑 Backend process exited with code ${code}`);
  });

  backendProcess.on("error", (err: Error) => {
    console.error("❌ Backend process error:", err);
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
      preload: path.join(_dirname, "preload.cjs"),
      devTools: true,
    },
  });

  const startUrl = isDev ? "http://localhost:3000" : `http://localhost:${port}`; // In prod, this will be http://localhost:3000 handled by backend

  // eslint-disable-next-line no-console
  console.log(`🌍 Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  // Initialize Managers after window is created
  trayManager = new TrayManager(mainWindow);
  notificationManager = new NotificationManager(mainWindow);
  
  if (!isDev) {
    updateManager = new UpdateManager(mainWindow);
  }

  // Handle minimize to tray
  (mainWindow as any).on("minimize", (event: any) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on("close", (event) => {
    if (!isAppQuiting) {
      event.preventDefault();
      mainWindow?.hide();
      return false;
    }
    return true;
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

// We keep a separate flag since augmenting the App interface in the same file can be tricky with ESM
let isAppQuiting = false;

app.on("before-quit", () => {
  isAppQuiting = true;
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  // We keep the app running in the background for the system tray
  // Empty, intentionally not quitting
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
