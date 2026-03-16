import React, { useState, useEffect } from "react";
import { githubService } from "../../services/github";
import { gitlabService } from "../../services/gitlab";
import IntegrationPermissionModal from "../../components/settings/IntegrationPermissionModal";

// Reusable Section Component (matching ProfileSettings)
const SettingsSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gh-border first:pt-0 first:border-0">
    <div className="md:col-span-1">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-gh-text-secondary mt-1">{description}</p>
    </div>
    <div className="md:col-span-2 bg-gh-bg-secondary border border-gh-border rounded-xl p-6 space-y-6 shadow-sm">
      {children}
    </div>
  </section>
);

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string; // Material symbol or image URL
  connected: boolean;
  color: string;
  isCustomIcon?: boolean;
}

const IntegrationCard: React.FC<{
  integration: Integration;
  onToggle: () => void;
}> = ({ integration, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-lg hover:border-slate-600 transition-colors">
    <div className="flex items-center gap-4">
      <div
        className={`size-12 rounded-lg bg-gh-bg border border-gh-border flex items-center justify-center ${integration.color}`}
      >
        <span className="material-symbols-outlined text-2xl">
          {integration.icon}
        </span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          {integration.name}
          {integration.connected && (
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Connected
            </span>
          )}
        </h4>
        <p className="text-xs text-gh-text-secondary mt-0.5">
          {integration.description}
        </p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${integration.connected
        ? "bg-transparent border-gh-border text-gh-text-secondary hover:text-white hover:border-red-500/50 hover:bg-red-500/10"
        : "bg-primary border-transparent text-white hover:bg-blue-600 shadow-lg shadow-primary/20"
        }`}
    >
      {integration.connected ? "Disconnect" : "Connect"}
    </button>
  </div>
);

const IntegrationsSettings = () => {
  // Initial State with Mock Data
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google",
      name: "Google",
      description:
        "Connect your Google account to sign in faster and sync data.",
      icon: "mail",
      connected: false,
      color: "text-red-500",
    },
    {
      id: "github",
      name: "GitHub",
      description:
        "Sync repositories, issues, and pull requests via Git protocol.",
      icon: "code",
      connected: false,
      color: "text-white",
    },
    {
      id: "gitlab",
      name: "GitLab",
      description: "Connect your GitLab projects and CI/CD pipelines.",
      icon: "code_blocks",
      connected: false,
      color: "text-orange-500",
    },
    {
      id: "forgebrowser",
      name: "ForgeBrowser",
      description: "Enable deep context search across web resources.",
      icon: "travel_explore",
      connected: true,
      color: "text-cyan-400",
    },
    {
      id: "quantalab",
      name: "QuantaLab",
      description: "Unified lab environment for AI experiments.",
      icon: "science",
      connected: false,
      color: "text-purple-400",
    },
    {
      id: "quantacode",
      name: "QuantaCode",
      description: "Advanced code analysis and refactoring engine.",
      icon: "code_off",
      connected: true,
      color: "text-emerald-400",
    },
  ]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("trackcodex_integrations");
    if (saved) {
      setIntegrations(JSON.parse(saved));
    }
  }, []);

  const toggleConnection = (id: string) => {
    const updated = integrations.map((int) =>
      int.id === id ? { ...int, connected: !int.connected } : int,
    );
    setIntegrations(updated);
    localStorage.setItem("trackcodex_integrations", JSON.stringify(updated));

    // Show notification
    const integration = updated.find((i) => i.id === id);
    if (integration) {
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: integration.connected
              ? "Integration Connected"
              : "Integration Disconnected",
            message: `${integration.name} has been ${integration.connected ? "successfully connected" : "disconnected"}.`,
            type: integration.connected ? "success" : "info",
          },
        }),
      );
    }
  };


  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pendingIntegration, setPendingIntegration] = useState<Integration | null>(null);

  // Manual Token flow state (Fallback)
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [activeIntegrationId, setActiveIntegrationId] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OAuth Handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const token = params.get("token");
    const username = params.get("username");

    if (service && token) {
      if (service === "github") {
        localStorage.setItem("trackcodex_github_token", token);
        if (username) localStorage.setItem("trackcodex_github_username", username);
        toggleConnection("github");
      } else if (service === "gitlab") {
        localStorage.setItem("trackcodex_gitlab_token", token);
        toggleConnection("gitlab");
      }

      // Clear URL
      window.history.replaceState({}, document.title, window.location.pathname);

      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "Integration Successful",
            message: `Successfully connected to ${service === 'github' ? 'GitHub' : 'GitLab'}.`,
            type: "success",
          },
        }),
      );
    }
  }, [integrations]);

  const handleConnectClick = (integration: Integration) => {
    if (integration.connected) {
      // Disconnect
      toggleConnection(integration.id);
      if (integration.id === "github")
        localStorage.removeItem("trackcodex_github_token");
      if (integration.id === "gitlab")
        localStorage.removeItem("trackcodex_gitlab_token");
    } else {
      // Open Permission Modal first
      setPendingIntegration(integration);
      setShowPermissionModal(true);
    }
  };

  const handlePermissionConfirm = () => {
    setShowPermissionModal(false);
    if (!pendingIntegration) return;

    // Check for valid Client ID
    const ghClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const glClientId = import.meta.env.VITE_GITLAB_CLIENT_ID;

    // Determine if we can do OAuth or fallback to manual token
    let canDoOAuth = false;
    // Check if client ID is valid (not undefined, empty, or placeholder)
    if (pendingIntegration.id === "github" && ghClientId && ghClientId !== "Iv1.8a61f9b3a7c42c2e" && ghClientId !== "YOUR_GITHUB_CLIENT_ID") canDoOAuth = true;
    if (pendingIntegration.id === "gitlab" && glClientId && glClientId !== "APP_ID") canDoOAuth = true;

    if (canDoOAuth) {
      // Initiate OAuth Flow
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem("oauth_state", state);
      localStorage.setItem("integration_return_path", window.location.pathname);

      if (pendingIntegration.id === "github") {
        const params = new URLSearchParams({
          client_id: ghClientId,
          redirect_uri: "http://localhost:3000/auth/callback/integration/github",
          scope: "repo read:user",
          state,
          allow_signup: "true"
        });
        window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
      } else if (pendingIntegration.id === "gitlab") {
        const params = new URLSearchParams({
          client_id: glClientId,
          redirect_uri: "http://localhost:3000/auth/callback/integration/gitlab",
          response_type: "code",
          scope: "api",
          state,
        });
        window.location.href = `https://gitlab.com/oauth/authorize?${params.toString()}`;
      }
    } else {
      // FALLBACK: Show Manual Token Entry
      setActiveIntegrationId(pendingIntegration.id);
      setShowTokenModal(true);
    }
    setPendingIntegration(null);
  };

  const submitToken = async () => {
    setError(null);
    setIsVerifying(true);
    try {
      if (activeIntegrationId === "github") {
        const data = await githubService.verifyToken(tokenInput);
        localStorage.setItem("trackcodex_github_token", tokenInput);
        if (data.login) {
          localStorage.setItem("trackcodex_github_username", data.login);
        }
      } else if (activeIntegrationId === "gitlab") {
        await gitlabService.verifyToken(tokenInput);
        localStorage.setItem("trackcodex_gitlab_token", tokenInput);
      }

      toggleConnection(activeIntegrationId || "");
      setShowTokenModal(false);
      setTokenInput("");

      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: `${activeIntegrationId === "github" ? "GitHub" : "GitLab"} Verified`,
            message: "Token valid. Fetching repositories...",
            type: "success",
          },
        }),
      );
    } catch (error) {
      console.error("Token verification failed:", error);
      setError("Invalid Personal Access Token. Please check scopes.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-10 relative">
      {/* Permission Modal */}
      <IntegrationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onConfirm={handlePermissionConfirm}
        integration={pendingIntegration}
      />

      {/* Token Modal - Fallback for when OAuth is not configured */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gh-bg-secondary border border-gh-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowTokenModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold text-white mb-2">
              Connect {activeIntegrationId === "github" ? "GitHub" : "GitLab"}
            </h3>
            <p className="text-sm text-yellow-500/80 mb-6 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
              <strong>Development Mode:</strong> OAuth Client ID not configured. Please enter a Personal Access Token manually.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={
                    activeIntegrationId === "github" ? "ghp_..." : "glpat-..."
                  }
                  className="w-full bg-gh-bg border border-gh-border rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                />
                {error && (
                  <p className="text-xs text-rose-500 mt-2 font-bold">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <a
                  href={
                    activeIntegrationId === "github"
                      ? "https://github.com/settings/tokens/new?scopes=repo&description=TrackCodex"
                      : "https://gitlab.com/-/profile/personal_access_tokens?name=TrackCodex&scopes=api"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-slate-400 transition-colors"
                >
                  Generate Token
                  <span className="material-symbols-outlined !text-[14px] ml-1">
                    open_in_new
                  </span>
                </a>
                <button
                  onClick={submitToken}
                  disabled={!tokenInput || isVerifying}
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {isVerifying ? "Verifying..." : "Connect"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Integrations
        </h1>
        <p className="text-sm text-gh-text-secondary mt-1 leading-relaxed">
          Connect external tools to enhance ForgeAI's context and capabilities.
        </p>
      </header>

      <SettingsSection
        title="Version Control"
        description="Connect your code repositories."
      >
        <div className="space-y-4">
          {integrations
            .filter((i) => ["google", "github", "gitlab"].includes(i.id))
            .map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={() => handleConnectClick(integration)}
              />
            ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Ecosystem Tools"
        description="Integrate with the wider Quantaforze LLC ecosystem."
      >
        <div className="space-y-4">
          {integrations
            .filter((i) => !["google", "github", "gitlab"].includes(i.id))
            .map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={() => handleConnectClick(integration)}
              />
            ))}
        </div>
      </SettingsSection>
    </div>
  );
};

export default IntegrationsSettings;
