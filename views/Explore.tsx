import React, { useState, useEffect } from "react";
import { Users, Search, TrendingUp, UserPlus, Star, Globe, Shield } from "lucide-react";
import { profileService } from "../services/profile";
import { workspaceService, Workspace } from "../services/workspaceService";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";

interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "workspaces">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingUsers, setTrendingUsers] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDiscoveryData();
  }, [activeTab]);

  const loadDiscoveryData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const [trending, suggested] = await Promise.all([
          profileService.getTrendingUsers(),
          profileService.getSuggestedUsers(),
        ]);
        setTrendingUsers(trending);
        setSuggestedUsers(suggested);
      } else {
        const publicWorkspaces = await workspaceService.getPublicWorkspaces();
        setWorkspaces(publicWorkspaces);
      }
    } catch (error) {
      console.error("Error loading discovery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await profileService.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await profileService.followUser(userId);
      // Refresh data
      loadDiscoveryData();
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await profileService.unfollowUser(userId);
      // Refresh data
      loadDiscoveryData();
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const renderUserCard = (user: User) => (
    <div key={user.id} className="user-card" onClick={() => navigate(`/profile/${user.username.replace('@', '')}`)}>
      <div className="user-card-header">
        <img
          src={
            user.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
          }
          alt={user.name}
          className="user-avatar"
        />
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-username">@{user.username.replace('@', '')}</p>
        </div>
        <button
          className={`follow-btn ${user.isFollowing ? "following" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id);
          }}
        >
          {user.isFollowing ? "Following" : "Follow"}
        </button>
      </div>
      {user.bio && <p className="user-bio">{user.bio}</p>}
      <div className="user-stats">
        <span>
          <strong>{user.followersCount || 0}</strong> followers
        </span>
        <span>
          <strong>{user.followingCount || 0}</strong> following
        </span>
      </div>
    </div>
  );

  const renderWorkspaceCard = (ws: Workspace) => (
    <div key={ws.id} className="workspace-card" onClick={() => navigate(`/workspaces/${ws.id}`)}>
      <div className="workspace-card-header">
        <div className="ws-icon">
          <Globe size={24} />
        </div>
        <div className="ws-info">
          <h3 className="ws-name">{ws.name}</h3>
          <p className="ws-owner">by {ws.owner?.name || ws.owner?.username || "Unknown"}</p>
        </div>
        <div className={`ws-badge ${ws.visibility}`}>
          {ws.visibility === "public" ? <Globe size={12} /> : <Shield size={12} />}
          {ws.visibility}
        </div>
      </div>
      {ws.description && <p className="ws-description">{ws.description}</p>}
      <div className="ws-stats">
        <span>
          <Star size={14} /> {ws.starsCount || 0}
        </span>
        <span className="ws-status">
          <span className={`status-indicator ${ws.status.toLowerCase()}`}></span>
          {ws.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>
          <Users size={32} /> Explore
        </h1>
        <p>Discover developers and projects in the TrackCodex community</p>
      </div>

      <div className="explore-tabs">
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={20} />
          Users
        </button>
        <button
          className={`tab ${activeTab === "workspaces" ? "active" : ""}`}
          onClick={() => setActiveTab("workspaces")}
        >
          <Star size={20} />
          Workspaces
        </button>
      </div>

      <div className="explore-content">
        {activeTab === "users" ? (
          <>
            {/* Search Section */}
            <div className="search-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <section className="explore-section">
                <h2>
                  <Search size={24} /> Search Results
                </h2>
                <div className="user-grid">
                  {searchResults.map(renderUserCard)}
                </div>
              </section>
            )}

            {/* Trending Users */}
            {!searchQuery && (
              <>
                <section className="explore-section">
                  <h2>
                    <TrendingUp size={24} /> Trending Developers
                  </h2>
                  <p className="section-subtitle">
                    Most followed developers this week
                  </p>
                  {loading ? (
                    <div className="loading">Loading...</div>
                  ) : (
                    <div className="user-grid">
                      {trendingUsers.map(renderUserCard)}
                    </div>
                  )}
                </section>

                {/* Suggested Users */}
                <section className="explore-section">
                  <h2>
                    <UserPlus size={24} /> Suggested for You
                  </h2>
                  <p className="section-subtitle">
                    Developers you might want to follow
                  </p>
                  {loading ? (
                    <div className="loading">Loading...</div>
                  ) : (
                    <div className="user-grid">
                      {suggestedUsers.map(renderUserCard)}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        ) : (
          <div className="workspace-discovery">
            <section className="explore-section">
              <h2>
                <Star size={24} /> Public Workspaces
              </h2>
              <p className="section-subtitle">
                Explore cloud environments and open-source projects
              </p>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : workspaces.length > 0 ? (
                <div className="workspace-grid">
                  {workspaces.map(renderWorkspaceCard)}
                </div>
              ) : (
                <div className="empty-state">
                  <Globe size={48} />
                  <p>No public workspaces found</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
