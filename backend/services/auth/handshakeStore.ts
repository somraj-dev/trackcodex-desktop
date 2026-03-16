import crypto from "crypto";

interface HandshakeEntry {
  status: "pending" | "completed";
  oneTimeToken?: string;
  sessionId?: string;
  createdAt: number;
}

// In-memory store for handshake flows
// In a highly scaled production app with multiple backend instances, this should be in Redis.
// But since the desktop app now spawns a local backend (which handles the handshake),
// an in-memory map is completely fine and doesn't require Redis dependency.
const handshakeStore = new Map<string, HandshakeEntry>();

// 5 minutes TTL
const TTL = 5 * 60 * 1000;

export function createHandshake(): string {
  const handshakeId = crypto.randomUUID();
  handshakeStore.set(handshakeId, {
    status: "pending",
    createdAt: Date.now(),
  });
  return handshakeId;
}

export function completeHandshake(handshakeId: string, sessionId: string): string | null {
  const entry = handshakeStore.get(handshakeId);
  if (!entry) return null;

  if (Date.now() - entry.createdAt > TTL) {
    handshakeStore.delete(handshakeId);
    return null;
  }

  const oneTimeToken = crypto.randomBytes(32).toString("hex");
  
  handshakeStore.set(handshakeId, {
    status: "completed",
    oneTimeToken,
    sessionId,
    createdAt: entry.createdAt,
  });

  return oneTimeToken;
}

export function exchangeHandshakeToken(token: string): string | null {
  // Find the entry that has this token
  let foundHandshakeId: string | null = null;
  let foundSessionId: string | null = null;

  for (const [id, entry] of handshakeStore.entries()) {
    if (Date.now() - entry.createdAt > TTL) {
      handshakeStore.delete(id);
      continue;
    }

    if (entry.status === "completed" && entry.oneTimeToken === token) {
      foundHandshakeId = id;
      foundSessionId = entry.sessionId || null;
      break;
    }
  }

  // Tokens are one-time use
  if (foundHandshakeId) {
    handshakeStore.delete(foundHandshakeId);
  }

  return foundSessionId;
}

// Cleanup interval to prevent memory leaks from abandoned handshakes
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of handshakeStore.entries()) {
    if (now - entry.createdAt > TTL) {
      handshakeStore.delete(id);
    }
  }
}, 60 * 1000); // Check every minute
