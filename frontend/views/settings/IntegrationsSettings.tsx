import React, { useState, useEffect, useCallback } from "react";
import { auth, githubProvider } from "../../lib/firebase";
import { signInWithRedirect, getRedirectResult, GithubAuthProvider } from "firebase/auth";
import { api } from "../../services/infra/api";
import IntegrationPermissionModal from "../../components/settings/IntegrationPermissionModal";

// Reusable Section Component (matching ProfileSettings)
const SettingsSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gh-border first:pt-0 first:border-[#1A1A1A]">
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
        : "bg-primary border-transparent text-white hover:bg-[#0A0A0A]lue-600 shadow-lg shadow-primary/20"
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

  // Load integration status from backend (server-side tokens only)
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const saved = localStorage.getItem("trackcodex_integrations");
        let current = integrations;
        if (saved) {
          current = JSON.parse(saved);
        }

        // Check connection status from backend (no tokens stored client-side)
        const status = await api.integrations.status();
        if (status?.connected) {
          current = current.map((int) => ({
            ...int,
            connected: !!status.connected[int.id],
          }));
        }

        setIntegrations(current);
      } catch {
        // Fall back to saved state
      }
    };
    loadStatus();
  }, []);

  const toggleConnection = useCallback((id: string) => {
    setIntegrations((prev) => {
      const updated = prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int,
      );
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
      return updated;
    });
  }, []);


  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pendingIntegration, setPendingIntegration] = useState<Integration | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);

  // OAuth Handler for custom backend-to-frontend redirect (if used)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const token = params.get("token");
    const username = params.get("username");

    if (service && token) {
      const submitOAuthToken = async () => {
        try {
          await api.integrations.connect(service, token, username || undefined);
          if (service === "github") {
            if (username) localStorage.setItem("trackcodex_github_username", username);
            toggleConnection("github");
            api.integrations.syncGithub().catch(console.error);
          }
        } catch { }
      };
      submitOAuthToken();

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toggleConnection]);

  // Handle Firebase Redirect Result
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const accessToken = credential?.accessToken;
          const githubUser = result.user;

          if (accessToken) {
            await api.integrations.connect("github", accessToken, githubUser.displayName || githubUser.email || undefined);
            if (githubUser.displayName) {
              localStorage.setItem("trackcodex_github_username", githubUser.displayName);
            }
            api.integrations.syncGithub().catch(console.error);
            toggleConnection("github");

            window.dispatchEvent(
              new CustomEvent("trackcodex-notification", {
                detail: {
                  title: "GitHub Connected",
                  message: "Successfully integrated with GitHub. Syncing data...",
                  type: "success",
                },
              }),
            );
          }
        }
      } catch (error) {
        console.error("Redirect error:", error);
      }
    };
    checkRedirect();
  }, [toggleConnection]);

  const handleConnectClick = (integration: Integration) => {
    if (integration.connected) {
      // Disconnect via backend
      toggleConnection(integration.id);
      try {
        api.integrations.disconnect(integration.id);
      } catch { }
    } else {
      // Open Permission Modal first
      setPendingIntegration(integration);
      setShowPermissionModal(true);
    }
  };

  const handlePermissionConfirm = async () => {
    setShowPermissionModal(false);
    if (!pendingIntegration) return;

    if (pendingIntegration.id === "github") {
      try {
        setIsVerifying(true);
        // Use Firebase signInWithRedirect for a full-page OAuth flow
        // The page will redirect to GitHub confirmation page
        await signInWithRedirect(auth, githubProvider);
      } catch (err: any) {
        console.error("GitHub OAuth redirect failed:", err);
        setIsVerifying(false);
      }
    } else if (pendingIntegration.id === "gitlab") {
      // GitLab can be implemented similarly with an OAuth provider if available
      // For now, if no GitLab OAuth is set up, we keep it simple or show a message
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "GitLab OAuth",
            message: "GitLab OAuth is currently being configured for this environment.",
            type: "info",
          },
        }),
      );
    } else {
      // For non-VCS integrations
      toggleConnection(pendingIntegration.id);
    }
    setPendingIntegration(null);
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


