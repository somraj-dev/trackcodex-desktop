import { contextBridge, ipcRenderer } from "electron";
import { authManager } from "./auth-manager";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  platform: {
    isDesktop: true,
  },
  env: {
    // Inject the dynamic API URL (e.g. http://localhost:45321) determined by the main process
    // This allows the frontend to talk to the specific spawned backend instance
    API_URL: process.env.ELECTRON_API_URL || "",
  },
  auth: {
    getToken: () => authManager.getToken(),
    setToken: (token: string) => authManager.setToken(token),
    clearToken: () => authManager.clearToken(),
    initiateHandshake: () => authManager.initiateHandshake(),
    onAuthSuccess: (callback: (token: string) => void) => {
      ipcRenderer.on("auth-success", (_event: unknown, token: string) => callback(token));
    }
  },
  onAuthToken: (callback: (token: string) => void) => {
    ipcRenderer.on("auth-token", (_event: unknown, token: string) => callback(token));
  },
  onNavigate: (callback: (url: string) => void) => {
    ipcRenderer.on("navigate-app", (_event: unknown, url: string) => callback(url));
  }
});
