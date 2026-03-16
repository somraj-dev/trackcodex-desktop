import { app, Tray, Menu, nativeImage, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TrayManager {
  private tray: Tray | null = null;
  private iconPath: string;

  constructor(private mainWindow: BrowserWindow) {
    // Assuming you have an icon in the build resources
    this.iconPath = path.join(__dirname, "../icon.png"); 
    
    // Create tray only when app is ready
    app.whenReady().then(() => {
      this.createTray();
    });
  }

  private createTray() {
    try {
      const icon = nativeImage.createFromPath(this.iconPath);
      // Resize for tray depending on platform. Let's make it 16x16 standard
      const trayIcon = icon.resize({ width: 16, height: 16 });
      
      this.tray = new Tray(trayIcon);
      this.tray.setToolTip("TrackCodex Desktop");
      
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Open TrackCodex",
          click: () => {
            if (this.mainWindow.isMinimized()) this.mainWindow.restore();
            this.mainWindow.show();
            this.mainWindow.focus();
          }
        },
        { type: "separator" },
        { 
          label: "Check for Updates...",
          click: () => {
            // Trigger update check via update-manager (implemented later)
            // But for now, just focus the window to keep user engaged
            if (this.mainWindow.isMinimized()) this.mainWindow.restore();
            this.mainWindow.show();
            this.mainWindow.focus();
          } 
        },
        { type: "separator" },
        {
          label: "Quit",
          click: () => {
            app.quit();
          }
        }
      ]);

      this.tray.setContextMenu(contextMenu);

      this.tray.on("click", () => {
        if (this.mainWindow.isVisible()) {
          this.mainWindow.hide();
        } else {
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      });
    } catch (error) {
      console.error("Failed to create system tray:", error);
    }
  }

  public setBadge(count: number) {
    if (app.dock) {
      app.dock.setBadge(count > 0 ? count.toString() : "");
    }
    // Windows/Linux don't have direct dock badge, would need custom icon drawing for tray
    // but setting tooltip is helpful
    if (this.tray) {
      this.tray.setToolTip(`TrackCodex Desktop${count > 0 ? ` (${count} unread)` : ""}`);
    }
  }
}
