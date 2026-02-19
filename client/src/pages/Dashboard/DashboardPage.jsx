import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";

export default function DashboardPage({ onNavigate }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    if (!userData) {
      showToast("Please login first", { type: "warning" });
      if (onNavigate) onNavigate("login");
      return;
    }
    setUser(userData);
    fetchComplaints(userData.id);
  }, [onNavigate, showToast]);

  const fetchComplaints = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/complaints/my?userId=${userId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      showToast("Failed to load complaints. Please try again.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
                className="page-nav-link active"
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
              <h1 className="page-title">My Complaints</h1>
              <p className="page-subtitle">
                View and track all your submitted complaints
              </p>
            </div>

            {loading ? (
              <div className="page-loading">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="page-empty">
                <div className="page-empty-icon">📋</div>
                <h2>No complaints yet</h2>
                <p>Start reporting issues in your community!</p>
                <button
                  type="button"
                  className="page-button-primary"
                  onClick={() => onNavigate && onNavigate("new-report")}
                >
                  Submit Your First Complaint
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
                        style={{
                          backgroundColor: getStatusColor(complaint.status),
                        }}
                      >
                        {getStatusLabel(complaint.status)}
                      </div>
                    </div>
                    <div className="complaint-card-content">
                      <div className="complaint-card-category">
                        {getCategoryLabel(complaint.category)}
                      </div>
                      <h3 className="complaint-card-title">
                        {complaint.title}
                      </h3>
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
          </main>
        </div>
      </div>
    </div>
  );
}
