import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../../utils/apiBase";

export default function CommunityMapPage({ onNavigate }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/complaints/all`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load community complaints.");
    } finally {
      setLoading(false);
    }
  };

  const initLeaflet = () =>
    new Promise((resolve) => {
      if (window.L) return resolve();

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (loading) return;

    let cancelled = false;

    const setup = async () => {
      await initLeaflet();
      if (cancelled || !window.L) return;

      const container = document.getElementById("community-issues-map");
      if (!container) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = window.L.map(container).setView([28.6139, 77.209], 12);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 0);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          map.setView([pos.coords.latitude, pos.coords.longitude], 12);
        });
      }
    };

    setup();
    return () => {
      cancelled = true;
    };
  }, [loading]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    issues.forEach((issue) => {
      const lat = issue?.location?.latitude;
      const lng = issue?.location?.longitude;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      const marker = window.L.marker([lat, lng]).addTo(mapRef.current);

      marker.bindPopup(`
        <div style="min-width:220px">
          <strong>${issue.title}</strong><br/>
          ${issue.description}<br/>
          👍 ${issue.upvotes ?? 0} | 👎 ${issue.downvotes ?? 0}<br/>
          Status: ${issue.status}
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [issues]);

  return (
    <div className="page-container">
      <div className="page-background">
        <div className="page-content">
          <header className="page-header">
            <div className="page-logo">
              <div className="page-logo-icon">🛣️</div>
              <span className="page-logo-text">Clean Street</span>
            </div>

            <nav className="page-nav">
              <button
                className="page-nav-link"
                onClick={() => onNavigate("home")}
              >
                Home
              </button>
              <button
                className="page-nav-link"
                onClick={() => onNavigate("my-complaints")}
              >
                My Complaints
              </button>
              <button
                className="page-nav-link"
                onClick={() => onNavigate("profile")}
              >
                Profile
              </button>
            </nav>

            <div className="page-header-actions">
              <button
                className="page-header-logout"
                onClick={() => onNavigate("community-reports")}
              >
                Track Community Issues
              </button>
            </div>
          </header>

          <main
            className="page-main"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <div className="page-title-section">
              <h1 className="page-title">Community Map</h1>
              <p className="page-subtitle">
                View all issues reported in your community
              </p>
            </div>

            {loading ? (
              <div className="page-loading">
                Loading community complaints...
              </div>
            ) : error ? (
              <div className="page-empty">{error}</div>
            ) : (
              <div
                id="community-issues-map"
                style={{
                  flex: 1,
                  width: "100%",
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
