import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../../utils/apiBase";

const OSRM_DIRECTIONS_BASE =
  "https://www.openstreetmap.org/directions?engine=osrm_car&route=";
const DEFAULT_CENTER = [28.6139, 77.209];
const FIXED_ZOOM = 11;

export default function CommunityMapPage({ onNavigate }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
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

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (loading) return;

    let cancelled = false;

    const setup = () => {
      if (!window.L) return;

      const container = document.getElementById("community-issues-map");
      if (!container) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = window.L.map(container).setView(DEFAULT_CENTER, FIXED_ZOOM);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapRef.current = map;

      setTimeout(() => map.invalidateSize(), 0);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled || !mapRef.current) return;
            const { latitude, longitude } = pos.coords;
            const coords = [latitude, longitude];
            setUserCoords(coords);
            mapRef.current.setView(coords, FIXED_ZOOM);
          },
          () => {},
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
        );
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

    const [fromLat, fromLng] = userCoords || DEFAULT_CENTER;

    issues.forEach((issue) => {
      const lat = issue?.location?.latitude;
      const lng = issue?.location?.longitude;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      const marker = window.L.marker([lat, lng]).addTo(mapRef.current);

      const directionsUrl = `${OSRM_DIRECTIONS_BASE}${fromLat},${fromLng};${lat},${lng}`;

      marker.bindPopup(`
        <div style="min-width:240px">
          <strong>${escapeHtml(issue.title)}</strong><br/>
          <span style="color:#555;font-size:13px">${escapeHtml(issue.description || "")}</span><br/>
          👍 ${issue.upvotes ?? 0} | 👎 ${issue.downvotes ?? 0} · ${issue.status || "pending"}<br/>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="margin-top:8px;display:inline-block;font-size:13px;color:#22c55e">Get directions (OSRM)</a>
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [issues, userCoords]);

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
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("home")}
              >
                Home
              </button>
              <button
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("my-complaints")}
              >
                My Complaints
              </button>
              <button
                type="button"
                className="page-nav-link active"
                onClick={() => onNavigate && onNavigate("community-map")}
              >
                Community Map
              </button>
              <button
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("community-reports")}
              >
                Community Issues
              </button>
              <button
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("profile")}
              >
                Profile
              </button>
            </nav>

            <div className="page-header-actions">
              <button
                type="button"
                className="page-header-logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  if (onNavigate) onNavigate("login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main
            className="page-main"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: "calc(100vh - 100px)",
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
                  minHeight: 400,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
