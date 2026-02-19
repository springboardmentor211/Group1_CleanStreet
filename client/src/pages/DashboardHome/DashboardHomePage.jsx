import { useState, useEffect } from "react";

export default function DashboardHomePage({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    myComplaints: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (!userData) {
      if (onNavigate) onNavigate("login");
      return;
    }

    setUser(userData);
    fetchStats(userData.id);
  }, [onNavigate]);

  const fetchStats = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:5000/api/complaints/stats?userId=${userId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await res.json();

      setStats({
        myComplaints: data.myComplaints || 0,
        resolved: data.resolved || 0,
        inProgress: data.inProgress || 0,
        pending: data.pending || 0,
      });
    } catch (err) {
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-home-container">
      <div className="dashboard-home-background">
        <div className="dashboard-home-content">
          <header className="dashboard-home-header">
            <div className="dashboard-home-logo">
              <div className="dashboard-home-logo-icon">🛣️</div>
              <span className="dashboard-home-logo-text">Clean Street</span>
            </div>

            <nav className="dashboard-home-nav">
              <button
                type="button"
                className="dashboard-home-nav-link active"
                onClick={() => onNavigate && onNavigate("home")}
              >
                Home
              </button>
              <button
                type="button"
                className="dashboard-home-nav-link"
                onClick={() => onNavigate && onNavigate("my-complaints")}
              >
                My Complaints
              </button>
              <button
                type="button"
                className="dashboard-home-nav-link"
                onClick={() => onNavigate && onNavigate("profile")}
              >
                Profile
              </button>
            </nav>

            <div className="dashboard-home-header-actions">
              <button
                type="button"
                className="dashboard-home-logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  if (onNavigate) onNavigate("login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="dashboard-home-main">
            <section className="dashboard-home-hero">
              <div className="dashboard-home-hero-content">
                <div className="dashboard-home-hero-text">
                  <h1 className="dashboard-home-hero-title">
                    Welcome back,{" "}
                    <span className="dashboard-home-hero-name">
                      {user.name}
                    </span>
                    !
                  </h1>
                  <p className="dashboard-home-hero-subtitle">
                    Help make your community cleaner and safer. Report issues,
                    track progress, and see real change happen.
                  </p>
                  <div className="dashboard-home-hero-actions">
                    <button
                      type="button"
                      className="dashboard-home-cta-primary"
                      onClick={() => onNavigate && onNavigate("new-report")}
                    >
                      <span className="dashboard-home-cta-icon">📸</span>
                      Report an Issue
                    </button>
                    <button
                      type="button"
                      className="dashboard-home-cta-secondary"
                      onClick={() => onNavigate && onNavigate("my-complaints")}
                    >
                      View My Complaints
                    </button>
                    <button
                      type="button"
                      className="dashboard-home-cta-tertiary"
                      onClick={() =>
                        onNavigate && onNavigate("community-reports")
                      }
                    >
                      Track Community Issues
                    </button>
                  </div>
                </div>

                <div className="dashboard-home-hero-visual">
                  <div className="dashboard-home-illustration">
                    <div className="dashboard-home-city-scene">
                      <div className="dashboard-home-building dashboard-home-building-1" />
                      <div className="dashboard-home-building dashboard-home-building-2" />
                      <div className="dashboard-home-building dashboard-home-building-3" />
                      <div className="dashboard-home-tree dashboard-home-tree-1" />
                      <div className="dashboard-home-tree dashboard-home-tree-2" />
                      <div className="dashboard-home-street" />
                      <div className="dashboard-home-sun" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-home-stats">
              {loading ? (
                <div className="dashboard-home-stats-loading">
                  Loading statistics...
                </div>
              ) : error ? (
                <div className="dashboard-home-stats-error">{error}</div>
              ) : (
                <>
                  <div className="dashboard-home-stat-card">
                    <div className="dashboard-home-stat-icon">📋</div>
                    <div className="dashboard-home-stat-content">
                      <div className="dashboard-home-stat-value">
                        {stats.myComplaints}
                      </div>
                      <div className="dashboard-home-stat-label">
                        My Reports
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-home-stat-card">
                    <div className="dashboard-home-stat-icon">✅</div>
                    <div className="dashboard-home-stat-content">
                      <div className="dashboard-home-stat-value">
                        {stats.resolved}
                      </div>
                      <div className="dashboard-home-stat-label">Resolved</div>
                    </div>
                  </div>

                  <div className="dashboard-home-stat-card">
                    <div className="dashboard-home-stat-icon">⏳</div>
                    <div className="dashboard-home-stat-content">
                      <div className="dashboard-home-stat-value">
                        {stats.inProgress}
                      </div>
                      <div className="dashboard-home-stat-label">
                        In Progress
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="dashboard-home-quick-actions">
              <h2 className="dashboard-home-section-title">Quick Actions</h2>

              <div className="dashboard-home-actions-grid">
                <button
                  type="button"
                  className="dashboard-home-action-card"
                  onClick={() => onNavigate && onNavigate("new-report")}
                >
                  <div className="dashboard-home-action-icon">📷</div>
                  <h3 className="dashboard-home-action-title">Report Issue</h3>
                  <p className="dashboard-home-action-desc">
                    Submit a new complaint with photos and location
                  </p>
                </button>

                <button
                  type="button"
                  className="dashboard-home-action-card"
                  onClick={() => onNavigate && onNavigate("my-complaints")}
                >
                  <div className="dashboard-home-action-icon">📊</div>
                  <h3 className="dashboard-home-action-title">My Complaints</h3>
                  <p className="dashboard-home-action-desc">
                    View and track all your submitted reports
                  </p>
                </button>

                <button
                  type="button"
                  className="dashboard-home-action-card"
                  onClick={() => onNavigate && onNavigate("community-map")}
                >
                  <div className="dashboard-home-action-icon">🗺️</div>
                  <h3 className="dashboard-home-action-title">Community Map</h3>
                  <p className="dashboard-home-action-desc">
                    See all issues reported in your area
                  </p>
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
