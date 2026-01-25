export default function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-sky-background">
        <div className="home-shell">
          <header className="home-header">
            <div className="home-logo">
              <div className="home-logo-icon">🛣️</div>
              <span className="home-logo-text">Clean Street</span>
            </div>

            <nav className="home-nav">
              <button type="button" className="home-nav-link">
                Home
              </button>
              <button type="button" className="home-nav-link">
                About
              </button>
              <button type="button" className="home-nav-link">
                Contact
              </button>
            </nav>

            <div className="home-header-actions">
              <button
                type="button"
                className="home-header-ghost"
                onClick={() => onNavigate && onNavigate("dashboard")}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="home-header-primary"
                onClick={() => onNavigate && onNavigate("new-report")}
              >
                New Report
              </button>
            </div>
          </header>

          <main className="home-main">
            <section className="home-hero">
              <div className="home-hero-left">
                <p className="home-kicker">
                  Clean Street: Simplifying Civic Issue Reporting.
                </p>
                <h1 className="home-hero-title">
                  Report public issues
                  <span className="home-hero-title-accent">
                    {" "}
                    in seconds
                  </span>
                  .
                </h1>
                <p className="home-hero-subtitle">
                  Report issues like garbage dumps, potholes, water leakage, and
                  broken streetlights in your community and track their
                  resolution in real time.
                </p>

                <div className="home-hero-actions">
                  <button
                    type="button"
                    className="home-cta-primary"
                    onClick={() => onNavigate && onNavigate("new-report")}
                  >
                    Get Started
                  </button>
                  <button
                    type="button"
                    className="home-cta-secondary"
                    onClick={() => onNavigate && onNavigate("dashboard")}
                  >
                    View My Reports
                  </button>
                </div>

                <div className="home-stats-row">
                  <div className="home-stat-card">
                    <div className="home-stat-label">Issue Reports</div>
                    <div className="home-stat-value">5,200+</div>
                  </div>
                  <div className="home-stat-card">
                    <div className="home-stat-label">Issues Fixed</div>
                    <div className="home-stat-value">3,800+</div>
                  </div>
                  <div className="home-stat-card">
                    <div className="home-stat-label">Active Volunteers</div>
                    <div className="home-stat-value">120+</div>
                  </div>
                </div>
              </div>

              <div className="home-hero-right">
                <div className="home-city-card">
                  <div className="home-city-building" />
                  <div className="home-city-streetlamp" />
                  <div className="home-city-ground" />
                </div>
              </div>
            </section>

            <section className="home-how">
              <h2 className="home-section-title">How It Works</h2>
              <div className="home-how-grid">
                <div className="home-how-card">
                  <div className="home-how-icon">📷</div>
                  <h3>Report Issues</h3>
                  <p>
                    Snap photos and report issues with precise location details
                    in just a few taps.
                  </p>
                </div>
                <div className="home-how-card">
                  <div className="home-how-icon">📊</div>
                  <h3>Track Progress</h3>
                  <p>
                    Monitor the status of reported issues and see how your
                    community is improving.
                  </p>
                </div>
                <div className="home-how-card">
                  <div className="home-how-icon">🔔</div>
                  <h3>Get Updates</h3>
                  <p>
                    Receive updates from authorities or volunteers as issues are
                    reviewed and resolved.
                  </p>
                </div>
              </div>
            </section>

            <section className="home-download">
              <div className="home-download-left">
                <h2 className="home-section-title">
                  Download Clean Street &amp; Improve Your Community!
                </h2>
                <p className="home-download-subtitle">
                  Use the mobile app to report on-the-go, receive live
                  notifications, and stay connected with your city.
                </p>
                <div className="home-store-badges">
                  <div className="home-store-badge"> App Store</div>
                  <div className="home-store-badge">▶ Google Play</div>
                </div>
              </div>
              <div className="home-download-right">
                <div className="home-phone-mock">
                  <div className="home-phone-header">Clean Street</div>
                  <div className="home-phone-map">
                    <div className="home-phone-pin home-phone-pin-1" />
                    <div className="home-phone-pin home-phone-pin-2" />
                    <div className="home-phone-pin home-phone-pin-3" />
                  </div>
                  <div className="home-phone-card-row">
                    <div className="home-phone-card" />
                    <div className="home-phone-card" />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

