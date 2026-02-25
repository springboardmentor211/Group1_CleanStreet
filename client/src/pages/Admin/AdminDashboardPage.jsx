import { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { API_BASE } from "../../utils/apiBase";
import cleanStreetLogo from "../../assets/illustrations/13300e7a-6ca5-4b88-b861-9bd2d84036eb 5.png";
import adminShieldIcon from "../../assets/illustrations/User Shield.jpg";
import surveyIcon from "../../assets/illustrations/Survey.png";
import checkMarkIcon from "../../assets/illustrations/Check Mark.png";
import thumbsIcon from "../../assets/illustrations/Thumbs Up Down.png";
import dragListIcon from "../../assets/illustrations/Drag List Down.png";
import editPencilIcon from "../../assets/illustrations/Edit Pencil.png";
import showPropertyIcon from "../../assets/illustrations/Show Property.png";
import peopleIcon from "../../assets/illustrations/People.png";
import usersMenuIcon from "../../assets/illustrations/Users.png";
import complaintsMenuIcon from "../../assets/illustrations/Edit Property.png";

const MOCK_USER = {
  _id: "admin-1",
  name: "Demo Admin",
  email: "admin@cleanstreet.local",
  role: "admin",
};

const STATIC_TOTAL_REVIEWS = "4k+";
const STATIC_RESOLVED_TODAY = 1;
const EDITABLE_STATUSES = ["pending", "in_progress", "resolved"];
const DASHBOARD_TABS = ["overview", "users", "manage"];

function getInitialDashboardTab() {
  const stored = sessionStorage.getItem("adminActiveTab");
  return DASHBOARD_TABS.includes(stored) ? stored : "overview";
}

export default function AdminDashboardPage({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(getInitialDashboardTab);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingComplaint, setResolvingComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintComments, setComplaintComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const dashboardUser = userData || MOCK_USER;
    setUser(dashboardUser);

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [complaintsResult, usersResult] = await Promise.allSettled([
          fetch(`${API_BASE}/api/admin/complaints`),
          fetch(`${API_BASE}/api/admin/users`),
        ]);

        let complaintList = [];
        let userList = [];

        if (
          complaintsResult.status === "fulfilled" &&
          complaintsResult.value.ok
        ) {
          const payload = await complaintsResult.value
            .json()
            .catch(() => ({ complaints: [] }));
          complaintList = Array.isArray(payload?.complaints)
            ? payload.complaints
            : [];
        }

        if (usersResult.status === "fulfilled" && usersResult.value.ok) {
          const payload = await usersResult.value
            .json()
            .catch(() => ({ users: [] }));
          userList = Array.isArray(payload?.users) ? payload.users : [];
        }

        if (!isCancelled) {
          setComplaints(complaintList);
          setUsers(userList);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
        if (!isCancelled) {
          setComplaints([]);
          setUsers([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!EDITABLE_STATUSES.includes(newStatus)) {
      return;
    }

    setResolvingComplaint(complaintId);

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/complaints/${complaintId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const payload = await response
        .json()
        .catch(() => ({ complaint: { status: newStatus } }));

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to update complaint status");
      }

      const updatedComplaint = payload?.complaint;

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId
            ? {
                ...c,
                ...updatedComplaint,
                status: updatedComplaint?.status || newStatus,
              }
            : c,
        ),
      );
    } catch (error) {
      console.error("Failed to update complaint status:", error);
    } finally {
      setResolvingComplaint(null);
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

  const getEditableStatus = (status) =>
    EDITABLE_STATUSES.includes(status) ? status : "pending";

  const openComplaintPopup = async (complaint) => {
    setSelectedComplaint(complaint);
    setComplaintComments([]);
    setLoadingComments(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/community/issues/${complaint._id}/comments`,
      );
      if (res.ok) {
        const data = await res.json();
        setComplaintComments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const closeComplaintPopup = () => {
    setSelectedComplaint(null);
    setComplaintComments([]);
  };

  const filteredComplaints = complaints
    .filter((c) => (filterStatus === "all" ? true : c.status === filterStatus))
    .sort((a, b) => {
      if (sortBy === "upvotes") return (b.upvotes || 0) - (a.upvotes || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(
    (c) => c.status === "pending",
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved",
  ).length;
  const todayComplaints = complaints.filter(
    (c) =>
      new Date(c.createdAt).toLocaleDateString() ===
      new Date().toLocaleDateString(),
  ).length;

  const overviewCards = [
    {
      id: "total-complaints",
      icon: surveyIcon,
      value: totalComplaints,
      label: "Total Complaints",
    },
    {
      id: "total-resolved",
      icon: checkMarkIcon,
      value: resolvedCount,
      label: "Total Resolved",
    },
    {
      id: "total-reviews",
      icon: thumbsIcon,
      value: STATIC_TOTAL_REVIEWS,
      label: "Total Reviews",
    },
    {
      id: "pending-works",
      icon: dragListIcon,
      value: pendingComplaints,
      label: "Pending Works",
    },
    {
      id: "today-complaints",
      icon: editPencilIcon,
      value: todayComplaints,
      label: "Today's Complaints",
    },
    {
      id: "resolved-today",
      icon: showPropertyIcon,
      value: STATIC_RESOLVED_TODAY,
      label: "Resolved Today",
    },
  ];

  if (!user || loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-background">
        <div className="admin-content">
          <div className="admin-title-row">
            <h1 className="admin-title">Admin Dashboard</h1>
            <div className="admin-auth-switch">
              <button
                type="button"
                className="admin-switch-btn"
                onClick={() => onNavigate && onNavigate("login")}
              >
                Log In
              </button>
              <button
                type="button"
                className="admin-switch-btn active"
                onClick={() => onNavigate && onNavigate("signup")}
              >
                Sign Up
              </button>
            </div>
          </div>

          <header className="admin-header">
            <div className="admin-logo">
              <img
                src={cleanStreetLogo}
                alt="CleanStreet"
                className="admin-logo-mark"
              />
              <span className="admin-logo-text">CLEAN STREET</span>
            </div>

            <div className="admin-header-actions">
              <button
                type="button"
                className="admin-logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  if (onNavigate) onNavigate("login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="admin-main">
            <div className="admin-sidebar">
              <div className="admin-panel-heading">
                <img
                  src={adminShieldIcon}
                  alt="Admin panel"
                  className="admin-panel-icon"
                />
                <div className="admin-panel-title">Admin panel</div>
              </div>
              <div className="admin-menu">
                <button
                  className={`admin-menu-item ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <img src={surveyIcon} alt="" className="admin-menu-icon" />
                  <span className="admin-menu-item-label">Overview</span>
                </button>
                <button
                  className={`admin-menu-item ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  <img src={usersMenuIcon} alt="" className="admin-menu-icon" />
                  <span className="admin-menu-item-label">Users</span>
                </button>
                <button
                  className="admin-menu-item"
                  onClick={() => onNavigate && onNavigate("admin-profile")}
                >
                  <img src={adminShieldIcon} alt="" className="admin-menu-icon" />
                  <span className="admin-menu-item-label">Profile</span>
                </button>
                <button
                  className={`admin-menu-item ${activeTab === "manage" ? "active" : ""}`}
                  onClick={() => setActiveTab("manage")}
                >
                  <img
                    src={complaintsMenuIcon}
                    alt=""
                    className="admin-menu-icon"
                  />
                  <span className="admin-menu-item-label">
                    Manage Complaints
                  </span>
                </button>
              </div>
            </div>

            <div className="admin-content-area">
              {activeTab === "overview" && (
                <div className="admin-section">
                  <h2 className="admin-section-title">System Overview</h2>

                  <div className="admin-stats-grid">
                    {overviewCards.map((card) => (
                      <article
                        key={card.id}
                        className={`admin-stat-card ${card.id === "total-resolved" ? "admin-stat-card-highlight" : ""}`}
                      >
                        <img
                          src={card.icon}
                          alt=""
                          className="admin-stat-icon-image"
                        />
                        <div className="admin-stat-value">{card.value}</div>
                        <div className="admin-stat-label">{card.label}</div>
                      </article>
                    ))}
                  </div>

                  <div className="admin-overview-footer">
                    <div className="admin-overview-footer-icon-wrap">
                      <img
                        src={peopleIcon}
                        alt=""
                        className="admin-overview-footer-icon"
                      />
                    </div>
                    <div className="admin-overview-footer-metrics">
                      <div className="admin-overview-footer-item">
                        <div className="admin-overview-footer-label">
                          Active Users
                        </div>
                        <div className="admin-overview-footer-value">4.5k+</div>
                      </div>
                      <div className="admin-overview-footer-item">
                        <div className="admin-overview-footer-label">
                          Under your area
                        </div>
                        <div className="admin-overview-footer-value">1.3k+</div>
                      </div>
                      <div className="admin-overview-footer-item">
                        <div className="admin-overview-footer-label">Others</div>
                        <div className="admin-overview-footer-value">3.2k+</div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-impact-section">
                    <h3 className="admin-impact-title">Community Impact</h3>
                    <p className="admin-impact-text">
                      Thanks to citizen reports and community engagement, we
                      have resolved {resolvedCount} issues this month.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "manage" && (
                <div className="admin-section">
                  <div className="admin-section-header">
                    <h2 className="admin-section-title">Manage Complaints</h2>
                    <div className="admin-filter">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="admin-filter-select"
                      >
                        <option value="date">Date (Newest)</option>
                        <option value="upvotes">Most Upvotes</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="admin-filter-select"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-complaints-list">
                    {filteredComplaints.length === 0 ? (
                      <div className="admin-empty-state">
                        <p>No complaints found with this status</p>
                      </div>
                    ) : (
                      filteredComplaints.map((complaint) => (
                        <div
                          key={complaint._id}
                          className="admin-complaint-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => openComplaintPopup(complaint)}
                        >
                          <div className="admin-complaint-image">
                            <img
                              src={complaint.photo}
                              alt={complaint.title}
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                          <div className="admin-complaint-details">
                            <h4 className="admin-complaint-title">
                              {complaint.title}
                            </h4>
                            <p className="admin-complaint-description">
                              {(complaint.description || "").substring(0, 100)}
                              ...
                            </p>
                            <div className="admin-complaint-meta">
                              <span className="admin-complaint-category">
                                {getCategoryLabel(complaint.category)}
                              </span>
                              <span className="admin-complaint-date">
                                {new Date(
                                  complaint.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="admin-complaint-status">
                            <span
                              className="admin-status-badge"
                              style={{
                                backgroundColor: getStatusColor(
                                  complaint.status,
                                ),
                              }}
                            >
                              {getStatusLabel(complaint.status)}
                            </span>
                          </div>
                          <div className="admin-complaint-actions">
                            <select
                              value={getEditableStatus(complaint.status)}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateComplaintStatus(
                                  complaint._id,
                                  e.target.value,
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              disabled={resolvingComplaint === complaint._id}
                              className="admin-status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ===== Complaint Detail Popup ===== */}
                  {selectedComplaint && (
                    <div
                      className="admin-popup-overlay"
                      onClick={closeComplaintPopup}
                    >
                      <div
                        className="admin-popup-content"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="admin-popup-close"
                          onClick={closeComplaintPopup}
                        >
                          &times;
                        </button>

                        <div className="admin-popup-image-wrap">
                          <img
                            src={selectedComplaint.photo}
                            alt={selectedComplaint.title}
                            className="admin-popup-image"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect fill='%23e5e7eb' width='400' height='260'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>

                        <h3 className="admin-popup-title">
                          {selectedComplaint.title}
                        </h3>

                        <p className="admin-popup-description">
                          {selectedComplaint.description}
                        </p>

                        <div className="admin-popup-details-grid">
                          <div className="admin-popup-detail">
                            <span className="admin-popup-detail-label">Category</span>
                            <span className="admin-popup-detail-value">
                              {getCategoryLabel(selectedComplaint.category)}
                            </span>
                          </div>
                          <div className="admin-popup-detail">
                            <span className="admin-popup-detail-label">Status</span>
                            <span
                              className="admin-status-badge"
                              style={{
                                backgroundColor: getStatusColor(
                                  selectedComplaint.status,
                                ),
                              }}
                            >
                              {getStatusLabel(selectedComplaint.status)}
                            </span>
                          </div>
                          <div className="admin-popup-detail">
                            <span className="admin-popup-detail-label">Upvotes</span>
                            <span className="admin-popup-detail-value admin-popup-upvotes">
                              ▲ {selectedComplaint.upvotes || 0}
                            </span>
                          </div>
                          <div className="admin-popup-detail">
                            <span className="admin-popup-detail-label">Downvotes</span>
                            <span className="admin-popup-detail-value admin-popup-downvotes">
                              ▼ {selectedComplaint.downvotes || 0}
                            </span>
                          </div>
                          <div className="admin-popup-detail">
                            <span className="admin-popup-detail-label">Reported by</span>
                            <span className="admin-popup-detail-value">
                              {selectedComplaint.userId?.name || "Unknown"}
                            </span>
                          </div>
                          <div className="admin-popup-detail">
                            <span className="admin-popup-detail-label">Date</span>
                            <span className="admin-popup-detail-value">
                              {new Date(
                                selectedComplaint.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {selectedComplaint.location?.address && (
                            <div className="admin-popup-detail admin-popup-detail-full">
                              <span className="admin-popup-detail-label">Location</span>
                              <span className="admin-popup-detail-value">
                                {selectedComplaint.location.address}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="admin-popup-comments-section">
                          <h4 className="admin-popup-comments-title">
                            Comments ({complaintComments.length})
                          </h4>
                          {loadingComments ? (
                            <p className="admin-popup-comments-loading">
                              Loading comments…
                            </p>
                          ) : complaintComments.length === 0 ? (
                            <p className="admin-popup-comments-empty">
                              No comments yet.
                            </p>
                          ) : (
                            <div className="admin-popup-comments-list">
                              {complaintComments.map((c) => (
                                <div
                                  key={c._id}
                                  className="admin-popup-comment"
                                >
                                  <div className="admin-popup-comment-header">
                                    <span className="admin-popup-comment-author">
                                      {c.author}
                                    </span>
                                    <span className="admin-popup-comment-date">
                                      {new Date(
                                        c.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="admin-popup-comment-content">
                                    {c.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "users" && (
                <div className="admin-section">
                  <h2 className="admin-section-title">
                    User Management ({users.length})
                  </h2>

                  <div className="admin-users-table">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Complaints Submitted</th>
                          <th>Joined Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="admin-table-empty">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr key={u._id}>
                              <td>{u.name}</td>
                              <td>{u.email}</td>
                              <td>{u.complaintCount || 0}</td>
                              <td>
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <span className="admin-user-status active">
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
