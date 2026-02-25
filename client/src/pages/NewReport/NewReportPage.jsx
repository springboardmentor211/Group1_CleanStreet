import { useState, useEffect, useRef } from "react";
import { useToast } from "../../context/ToastContext";

export default function NewReportPage({ onNavigate }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    photo: null,
    photoPreview: null,
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
  });

  const mapRef = useRef(null);

  useEffect(() => {
    let userData = null;
    try {
      const stored = localStorage.getItem("user");
      userData = stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("user");
    }

    if (!userData) {
      if (onNavigate) onNavigate("login");
      return;
    }

    setUser(userData);
  }, [onNavigate]);

  useEffect(() => {
    if (!user) return;

    const initializeMap = () => {
      if (!document.getElementById("map-container")) return;

      if (window.L) {
        if (mapRef.current) return;

        const map = window.L.map("map-container").setView(
          [28.6139, 77.209],
          13,
        );

        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        ).addTo(map);

        let marker = null;

        map.on("click", (e) => {
          const { lat, lng } = e.latlng;

          if (marker) map.removeLayer(marker);
          marker = window.L.marker([lat, lng]).addTo(map);

          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: lat,
              longitude: lng,
            },
          }));

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          )
            .then((res) => res.json())
            .then((data) => {
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: data.display_name || "",
                },
              }));
            })
            .catch(() => {});
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 13);
              marker = window.L.marker([latitude, longitude]).addTo(map);

              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  latitude,
                  longitude,
                },
              }));
            },
            () => {},
          );
        }

        mapRef.current = map;
      } else {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initializeMap;
        document.body.appendChild(script);
      }
    };

    const timeout = setTimeout(initializeMap, 0);

    return () => {
      clearTimeout(timeout);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result,
        photoPreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.photo) {
      showToast("Please upload a photo", { type: "warning" });
      return;
    }

    if (
      formData.location.latitude === null ||
      formData.location.longitude === null
    ) {
      showToast("Please select a location on the map", { type: "warning" });
      return;
    }

    const userId = user.id || user._id || user.userId;

    if (!userId) {
      showToast("User authentication error. Please login again.", {
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: formData.title,
          description: formData.description,
          photo: formData.photo,
          location: formData.location,
          category: formData.category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to submit complaint", {
          type: "error",
        });
        return;
      }

      showToast("Complaint submitted successfully!", { type: "success" });
      if (onNavigate) onNavigate("home");
    } catch {
      showToast("Server error. Please try again.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
              <h1 className="page-title">Submit New Complaint</h1>
              <p className="page-subtitle">
                Report an issue in your community with photos and location
              </p>
            </div>

            <form className="report-form" onSubmit={handleSubmit}>
              <div className="report-form-section">
                <h2 className="report-section-title">Complaint Details</h2>

                <div className="report-form-group">
                  <label className="report-form-label">Title *</label>
                  <input
                    type="text"
                    className="report-form-input"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="report-form-group">
                  <label className="report-form-label">Category *</label>
                  <select
                    className="report-form-input"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    required
                    disabled={loading}
                  >
                    <option value="garbage">Garbage Dump</option>
                    <option value="pothole">Pothole</option>
                    <option value="water_leakage">Water Leakage</option>
                    <option value="broken_streetlight">
                      Broken Streetlight
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="report-form-group">
                  <label className="report-form-label">Description *</label>
                  <textarea
                    className="report-form-textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    rows={4}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="report-form-section">
                <h2 className="report-section-title">Photo *</h2>
                <div className="report-photo-upload">
                  {formData.photoPreview ? (
                    <div className="report-photo-preview">
                      <img
                        src={formData.photoPreview}
                        alt="Preview"
                        className="report-photo-img"
                      />
                      <button
                        type="button"
                        className="report-photo-remove"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            photo: null,
                            photoPreview: null,
                          }))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="report-photo-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="report-photo-input"
                        disabled={loading}
                      />
                      <div className="report-photo-placeholder">
                        <span className="report-photo-icon">📷</span>
                        <span>Click to upload photo</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="report-form-section">
                <h2 className="report-section-title">Location *</h2>
                <div id="map-container" className="report-map" />
                {formData.location.address && (
                  <div className="report-location-address">
                    📍 {formData.location.address}
                  </div>
                )}
              </div>

              <div className="report-form-actions">
                <button
                  type="button"
                  className="report-button-secondary"
                  onClick={() => onNavigate && onNavigate("home")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="report-button-primary"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
