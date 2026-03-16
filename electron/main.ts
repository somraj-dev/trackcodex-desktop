import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import net from "net";
import { fileURLToPath } from "url";

import { authManager } from "./auth-manager";
import { TrayManager } from "./tray-manager";
import { NotificationManager } from "./notification-manager";
import { UpdateManager } from "./update-manager";
import Store from "electron-store";

// Initialize the store
Store.initRenderer();

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Native check for dev environment
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;
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

  // Initialize Managers after window is created
  trayManager = new TrayManager(mainWindow);
  notificationManager = new NotificationManager(mainWindow);
  
  if (!isDev) {
    updateManager = new UpdateManager(mainWindow);
  }

  // Handle minimize to tray
  mainWindow.on("minimize", (event: any) => {
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
