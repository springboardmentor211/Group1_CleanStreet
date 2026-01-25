import { useState, useEffect } from "react";

export default function CommunityMapPage({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    if (!userData) {
      alert("Please login first");
      if (onNavigate) onNavigate("login");
      return;
    }
    setUser(userData);
    fetchAllComplaints();
    initMap();
  }, [onNavigate]);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:5000/api/complaints/all");

      if (!res.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load community complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initMap = () => {
    if (window.L) {
      setupMap();
    } else {
      // Load Leaflet CSS and JS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        window.L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/";
        setupMap();
      };
      document.body.appendChild(script);
    }
  };

  const [mapInstance, setMapInstance] = useState(null);

  const setupMap = () => {
    if (!window.L) return;

    // Check if map already exists
    const mapContainer = document.getElementById("community-map-container");
    if (!mapContainer) return;

    // Remove existing map if any
    if (mapInstance) {
      mapInstance.remove();
    }

    // Default to a central location (can be changed based on user location)
    const map = window.L.map("community-map-container").setView([28.6139, 77.209], 13);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        () => {
          console.log("Could not get user location");
        }
      );
    }

    setMapInstance(map);
    setMapLoaded(true);
  };

  // Add markers when complaints are loaded and map is ready
  useEffect(() => {
    if (mapInstance && complaints.length > 0 && window.L) {
      // Clear existing markers
      mapInstance.eachLayer((layer) => {
        if (layer instanceof window.L.CircleMarker || layer instanceof window.L.Marker) {
          mapInstance.removeLayer(layer);
        }
      });

      complaints.forEach((complaint) => {
        if (complaint.location && complaint.location.latitude && complaint.location.longitude) {
          const statusColors = {
            pending: "#f59e0b",
            in_progress: "#3b82f6",
            resolved: "#22c55e",
            rejected: "#ef4444",
          };

          const marker = window.L.circleMarker(
            [complaint.location.latitude, complaint.location.longitude],
            {
              radius: 8,
              fillColor: statusColors[complaint.status] || "#f59e0b",
              color: "#fff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }
          ).addTo(mapInstance);

          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${complaint.title}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? "..." : ""}</p>
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                <span style="padding: 4px 8px; background: ${statusColors[complaint.status] || "#f59e0b"}; color: white; border-radius: 4px; font-size: 12px; text-transform: capitalize;">${complaint.status.replace("_", " ")}</span>
                <span style="font-size: 12px; color: #666;">${complaint.category}</span>
              </div>
              ${complaint.location.address ? `<p style="margin: 0; font-size: 12px; color: #999;">📍 ${complaint.location.address}</p>` : ""}
            </div>
          `;

          marker.bindPopup(popupContent);
        }
      });
    }
  }, [complaints, mapInstance]);

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "#22c55e";
      case "in_progress":
        return "#3b82f6";
      case "rejected":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  const getCategoryLabel = (category) => {
    const labels = {
      garbage: "Garbage Dump",
      pothole: "Pothole",
      water_leakage: "Water Leakage",
      broken_streetlight: "Broken Streetlight",
      other: "Other",
    };
    return labels[category] || "Other";
  };

  if (!user) {
    return null;
  }

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

          <main className="page-main">
            <div className="page-title-section">
              <h1 className="page-title">Community Map</h1>
              <p className="page-subtitle">
                View all issues reported in your community
              </p>
            </div>

            {loading ? (
              <div className="page-loading">Loading community complaints...</div>
            ) : error ? (
              <div className="page-empty">
                <div className="page-empty-icon">⚠️</div>
                <h2>Error</h2>
                <p>{error}</p>
                <button
                  type="button"
                  className="page-button-primary"
                  onClick={fetchAllComplaints}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div id="community-map-container" className="report-map" style={{ height: "500px", marginBottom: "2rem" }} />
                
                {complaints.length === 0 ? (
                  <div className="page-empty">
                    <div className="page-empty-icon">🗺️</div>
                    <h2>No complaints yet</h2>
                    <p>Be the first to report an issue in your community!</p>
                    <button
                      type="button"
                      className="page-button-primary"
                      onClick={() => onNavigate && onNavigate("new-report")}
                    >
                      Report an Issue
                    </button>
                  </div>
                ) : (
                  <div className="complaints-grid">
                    {complaints.map((complaint) => (
                      <div key={complaint._id} className="complaint-card">
                        <div className="complaint-card-image">
                          <img
                            src={complaint.photo}
                            alt={complaint.title}
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div
                            className="complaint-status-badge"
                            style={{ backgroundColor: getStatusColor(complaint.status) }}
                          >
                            {getStatusLabel(complaint.status)}
                          </div>
                        </div>
                        <div className="complaint-card-content">
                          <div className="complaint-card-category">
                            {getCategoryLabel(complaint.category)}
                          </div>
                          <h3 className="complaint-card-title">{complaint.title}</h3>
                          <p className="complaint-card-description">
                            {complaint.description}
                          </p>
                          <div className="complaint-card-meta">
                            <span className="complaint-card-date">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                            {complaint.location?.address && (
                              <span className="complaint-card-location">
                                📍 {complaint.location.address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
