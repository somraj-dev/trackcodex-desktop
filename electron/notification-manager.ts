import { Notification, BrowserWindow } from "electron";
import { io, Socket } from "socket.io-client";
import { authManager } from "./auth-manager";

export class NotificationManager {
  private socket: Socket | null = null;
  private readonly _wsUrl = "ws://localhost:4000";

  constructor(private mainWindow: BrowserWindow) {
    this.connectSocket();
  }

  private connectSocket() {
    const token = authManager.getToken();
    if (!token) {
      // We will reconnect later when token changes
      return; 
    }

    this.socket = io(this._wsUrl, {
      path: "/socket.io/",
      transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`
      }
    });

    this.socket.on("connect", () => {
      console.log("Desktop Socket.IO connected for notifications");
    });

    this.socket.on("new_message", (data: any) => {
      this.showNotification(
        "New Message",
        `${data.senderName}: ${data.preview || "Sent an attachment"}`,
        () => {
          this.focusApp();
          this.mainWindow.webContents.send("navigate-app", `/messages/${data.conversationId}`);
        }
      );
    });

    this.socket.on("pr_review", (data: any) => {
      this.showNotification(
        "Pull Request Reviewed",
        `${data.reviewerName} ${data.action} your PR #${data.prNumber}`,
        () => {
          this.focusApp();
          this.mainWindow.webContents.send("navigate-app", `/repo/${data.repoId}/pull/${data.prNumber}`);
        }
      );
    });
    
    this.socket.on("ci_status", (data: any) => {
       const badge = data.status === "success" ? "✅" : data.status === "failed" ? "❌" : "⏳";
       this.showNotification(
          "CI Pipeline Update",
          `${badge} ${data.workflowName} on ${data.branch} - ${data.status}`,
          () => {
            this.focusApp();
            this.mainWindow.webContents.send("navigate-app", `/repo/${data.repoId}/actions/runs/${data.runId}`);
          }
       )
    });

    this.socket.on("disconnect", () => {
      console.log("Desktop Socket.IO disconnected");
    });
  }

  public reconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connectSocket();
  }

  private showNotification(title: string, body: string, onClick?: () => void) {
    if (!Notification.isSupported()) return;

    const notification = new Notification({
      title,
      body,
      // icon: path.join(__dirname, "../icon.png")
    });

    if (onClick) {
      notification.on("click", onClick);
    }

    notification.show();
  }

  private focusApp() {
    if (this.mainWindow.isMinimized()) this.mainWindow.restore();
    this.mainWindow.show();
    this.mainWindow.focus();
  }
}
