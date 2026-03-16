import { shell, safeStorage } from "electron";
import Store from "electron-store";
import axios from "axios";

const store = new Store();

export class AuthManager {
  private _sessionToken: string | null = null;
  private readonly _apiUrl = "http://localhost:4000/api/v1"; 

  constructor() {
    this._loadToken();
  }

  private _loadToken() {
    try {
      if (store.has("encrypted_session_token")) {
        const encrypted = Buffer.from(store.get("encrypted_session_token") as string, "base64");
        if (safeStorage.isEncryptionAvailable()) {
          this._sessionToken = safeStorage.decryptString(encrypted);
        }
      }
    } catch (error) {
      console.error("Failed to load session token:", error);
    }
  }

  public setToken(token: string) {
    this._sessionToken = token;
    try {
      if (safeStorage.isEncryptionAvailable()) {
        const encrypted = safeStorage.encryptString(token);
        store.set("encrypted_session_token", encrypted.toString("base64"));
      } else {
        // Fallback for systems without safeStorage (e.g. dev environments missing keychains)
        store.set("encrypted_session_token", Buffer.from(token).toString("base64")); 
      }
    } catch (error) {
      console.error("Failed to save session token:", error);
    }
  }

  public getToken(): string | null {
    return this._sessionToken;
  }

  public clearToken() {
    this._sessionToken = null;
    store.delete("encrypted_session_token");
  }

  public async initiateHandshake(): Promise<{ handshakeId: string }> {
    try {
      // Create handshake request to the local backend
      const response = await axios.post(`${this._apiUrl}/auth/desktop/handshake/initiate`);
      const { handshakeId, loginUrl } = response.data;
      
      // Open the user's default browser to the login page
      await shell.openExternal(loginUrl);
      
      return { handshakeId };
    } catch (error) {
      console.error("Failed to initiate handshake:", error);
      throw error;
    }
  }

  public async exchangeHandshakeToken(token: string): Promise<{ sessionId: string, user: any }> {
    try {
      const response = await axios.post(`${this._apiUrl}/auth/desktop/handshake/exchange`, {
        token
      });
      
      const { sessionId, user } = response.data;
      this.setToken(sessionId);
      
      return { sessionId, user };
    } catch (error) {
      console.error("Failed to exchange token:", error);
      throw error;
    }
  }
}

export const authManager = new AuthManager();
