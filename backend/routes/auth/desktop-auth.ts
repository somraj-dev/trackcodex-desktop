import { FastifyInstance } from "fastify";
import { 
  createHandshake, 
  completeHandshake, 
  exchangeHandshakeToken 
} from "../../services/auth/handshakeStore";
import { getSession } from "../../services/session";
import { BadRequest, Unauthorized } from "../../utils/AppError";

export async function desktopAuthRoutes(fastify: FastifyInstance) {
  // 1. Desktop App calls this to start login
  fastify.post("/handshake/initiate", async (_request, _reply) => {
    const handshakeId = createHandshake();
    
    // The browser url where the user will log in
    // This assumes the frontend exposes a route at /desktop-login?handshake_id=xyz
    // In production, the local backend will redirect to the remote trackcodex.com frontend
    // In dev, it might redirect to localhost:3000
    const frontendUrl = process.env.FRONTEND_URL || "https://trackcodex.com";
    
    // Using a special auth portal route specifically for the desktop handshake
    const loginUrl = `${frontendUrl}/desktop-login?handshake_id=${handshakeId}`;

    return {
      handshakeId,
      loginUrl,
      status: "pending"
    };
  });

  // 2. Browser hits this endpoint AFTER a successful web login
  // Web login sets the normal cookie. The frontend then calls this endpoint.
  fastify.post("/handshake/complete", async (request, _reply) => {
    const { handshakeId } = request.body as { handshakeId: string };
    
    if (!handshakeId) {
      throw BadRequest("Handshake ID required");
    }

    // Since this is called from the browser, we should have a valid session cookie
    let sessionId = request.cookies?.session_id;

    if (!sessionId && request.headers.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        sessionId = authHeader.substring(7);
      }
    }

    if (!sessionId) {
      throw Unauthorized("You must be logged in to complete the desktop handshake.");
    }

    // Verify session is real
    const session = await getSession(sessionId);
    if (!session) {
      throw Unauthorized("Invalid session.");
    }

    const oneTimeToken = completeHandshake(handshakeId, sessionId);
    if (!oneTimeToken) {
      throw BadRequest("Handshake expired or invalid.");
    }

    // We return the oneTimeToken back to the browser.
    // The browser will then redirect the user to trackcodex://auth/callback?token=<token>
    return { success: true, token: oneTimeToken };
  });

  // 3. Desktop App receives the deep link with the token, and calls this to get the real session
  fastify.post("/handshake/exchange", async (request, _reply) => {
    const { token } = request.body as { token: string };

    if (!token) {
      throw BadRequest("Exchange token required");
    }

    const sessionId = exchangeHandshakeToken(token);
    
    if (!sessionId) {
      throw Unauthorized("Invalid or expired exchange token.");
    }

    // Fetch the user data to return it
    const session = await getSession(sessionId);
    if (!session) {
      throw Unauthorized("Session attached to token is no longer valid.");
    }

    // The desktop app now has the sessionId.
    // It will store it securely and send it as a Bearer token in subsequent API requests.
    return {
      success: true,
      sessionId,
      user: {
        id: session.userId,
        email: session.email,
        username: session.username,
        name: session.name,
        avatar: session.avatar,
        role: session.role
      }
    };
  });
}
