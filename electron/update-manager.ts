import { autoUpdater } from "electron-updater";
import { Notification, BrowserWindow, dialog } from "electron";

export class UpdateManager {
  constructor(private mainWindow: BrowserWindow) {
    this.initUpdater();
  }

  private initUpdater() {
    // Check for updates silently in background
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on("checking-for-update", () => {
      console.log("Checking for update...");
    });

    autoUpdater.on("update-available", (info) => {
      console.log("Update available:", info.version);
      const notification = new Notification({
        title: "Update Available",
        body: `Downloading version ${info.version} in background...`
      });
      notification.show();
    });

    autoUpdater.on("update-not-available", () => {
      console.log("Update not available.");
    });

    autoUpdater.on("error", (err) => {
      console.error("Error in auto-updater:", err);
    });

    autoUpdater.on("update-downloaded", (info) => {
      console.log("Update downloaded:", info.version);
      
      const notification = new Notification({
        title: "TrackCodex Update Ready",
        body: `Version ${info.version} has been downloaded. Click to restart and install.`,
      });

      notification.on("click", () => {
        autoUpdater.quitAndInstall();
      });

      notification.show();
      
      // Also notify via renderer side
      this.mainWindow.webContents.send("update-downloaded", info.version);
    });

    // Check on startup
    autoUpdater.checkForUpdatesAndNotify();
    
    // Check every 4 hours
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 4 * 60 * 60 * 1000);
  }
  
  public checkForUpdates() {
     autoUpdater.checkForUpdatesAndNotify();
  }
}
