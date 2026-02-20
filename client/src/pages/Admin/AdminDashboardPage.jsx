import { useState, useEffect } from "react";
import "./AdminDashboard.css";
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
import reportsMenuIcon from "../../assets/illustrations/Heat Map.png";
import complaintsMenuIcon from "../../assets/illustrations/Edit Property.png";

const MOCK_USER = {
  _id: "admin-1",
  name: "Demo Admin",
  email: "admin@cleanstreet.local",
  role: "admin",
};

const MOCK_COMPLAINTS = [
  {
    _id: "cmp-1",
    title: "Overflowing garbage bins",
    description:
      "Garbage bins near Central Park are overflowing and attracting stray animals.",
    category: "garbage",
    status: "pending",
    createdAt: "2026-02-18T09:30:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=60",
  },
  {
    _id: "cmp-2",
    title: "Large pothole on main road",
    description:
      "There is a deep pothole on 5th Avenue causing traffic slowdown and bike accidents.",
    category: "pothole",
    status: "in_progress",
    createdAt: "2026-02-17T14:20:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=300&q=60",
  },
  {
    _id: "cmp-3",
    title: "Broken streetlight in residential lane",
    description:
      "Streetlight has been out for several nights, making the lane unsafe.",
    category: "broken_streetlight",
    status: "resolved",
    createdAt: "2026-02-16T20:10:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=60",
  },
  {
    _id: "cmp-4",
    title: "Water leakage near bus stop",
    description:
      "Constant water leakage from a roadside pipe is flooding the footpath.",
    category: "water_leakage",
    status: "rejected",
    createdAt: "2026-02-15T08:45:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=300&q=60",
  },
];

const MOCK_USERS = [
  {
    _id: "usr-1",
    name: "Aarav Singh",
    email: "aarav@example.com",
    complaintCount: 3,
    createdAt: "2026-01-14T11:00:00.000Z",
  },
  {
    _id: "usr-2",
    name: "Sara Khan",
    email: "sara@example.com",
    complaintCount: 1,
    createdAt: "2026-01-21T15:30:00.000Z",
  },
  {
    _id: "usr-3",
    name: "Noah Lee",
    email: "noah@example.com",
    complaintCount: 2,
    createdAt: "2026-02-02T10:10:00.000Z",
  },
];

const buildStats = (complaintList, userList) => ({
  totalComplaints: complaintList.length,
  pendingComplaints: complaintList.filter((c) => c.status === "pending").length,
  activeUsers: userList.length,
  resolvedToday: complaintList.filter((c) => c.status === "resolved").length,
});

export default function AdminDashboardPage({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    activeUsers: 0,
    resolvedToday: 0,
  });
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingComplaint, setResolvingComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const dashboardUser = userData || MOCK_USER;

    setUser(dashboardUser);
    setComplaints(MOCK_COMPLAINTS);
    setUsers(MOCK_USERS);
    setStats(buildStats(MOCK_COMPLAINTS, MOCK_USERS));
    setLoading(false);
  }, [onNavigate]);

  const updateComplaintStatus = (complaintId, newStatus) => {
    setResolvingComplaint(complaintId);

    const updatedComplaints = complaints.map((c) =>
      c._id === complaintId ? { ...c, status: newStatus } : c,
    );

    setComplaints(updatedComplaints);
    setStats(buildStats(updatedComplaints, users));
    setResolvingComplaint(null);
  };

  const generateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      admin: user?.name || MOCK_USER.name,
      stats,
      complaints: complaints.length,
      users: users.length,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `admin-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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

  const filteredComplaints = complaints.filter((c) =>
    filterStatus === "all" ? true : c.status === filterStatus,
  );

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
      value: stats.totalComplaints,
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
      value: "4k+",
      label: "Total Reviews",
    },
    {
      id: "pending-works",
      icon: dragListIcon,
      value: stats.pendingComplaints,
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
      value: stats.resolvedToday,
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

            <nav className="admin-nav">
              <button
                type="button"
                className={`admin-nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Dashboard
              </button>
              <button
                type="button"
                className={`admin-nav-link ${activeTab === "manage" ? "active" : ""}`}
                onClick={() => setActiveTab("manage")}
              >
                Report Issue
              </button>
              <button
                type="button"
                className={`admin-nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                View Complaint
              </button>
              <button
                type="button"
                className={`admin-nav-link admin-active ${activeTab === "reports" ? "active" : ""}`}
                onClick={() => setActiveTab("reports")}
              >
                Admin
              </button>
            </nav>

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
                  className={`admin-menu-item ${activeTab === "reports" ? "active" : ""}`}
                  onClick={() => setActiveTab("reports")}
                >
                  <img
                    src={reportsMenuIcon}
                    alt=""
                    className="admin-menu-icon"
                  />
                  <span className="admin-menu-item-label">Reports</span>
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
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="admin-filter-select"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
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
                              value={complaint.status}
                              onChange={(e) =>
                                updateComplaintStatus(
                                  complaint._id,
                                  e.target.value,
                                )
                              }
                              disabled={resolvingComplaint === complaint._id}
                              className="admin-status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="admin-section">
                  <h2 className="admin-section-title">User Management</h2>

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

              {activeTab === "reports" && (
                <div className="admin-section">
                  <h2 className="admin-section-title">Generate Reports</h2>

                  <div className="admin-reports-grid">
                    <div className="admin-report-card">
                      <div className="admin-report-icon">System</div>
                      <h3>System Report</h3>
                      <p>
                        Complete system overview including complaints, users,
                        and statistics
                      </p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download Report
                      </button>
                    </div>

                    <div className="admin-report-card">
                      <div className="admin-report-icon">Analytics</div>
                      <h3>Complaint Analytics</h3>
                      <p>
                        Detailed analysis of complaints by category and status
                      </p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download Report
                      </button>
                    </div>

                    <div className="admin-report-card">
                      <div className="admin-report-icon">Users</div>
                      <h3>User Activity Report</h3>
                      <p>Monitor user activities and engagement metrics</p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download Report
                      </button>
                    </div>

                    <div className="admin-report-card">
                      <div className="admin-report-icon">Geo</div>
                      <h3>Geographic Distribution</h3>
                      <p>Issues mapped by location and category</p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download Report
                      </button>
                    </div>
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
