import { useState, useEffect } from "react";
import "./AdminDashboard.css";

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
    if (!userData || userData.role !== "admin") {
      alert("Unauthorized access");
      if (onNavigate) onNavigate("login");
      return;
    }
    setUser(userData);
    fetchAllData();
  }, [onNavigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchComplaints(),
        fetchUsers(),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/complaints");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      setResolvingComplaint(complaintId);
      const res = await fetch(`http://localhost:5000/api/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update complaint");
      
      setComplaints(complaints.map(c =>
        c._id === complaintId ? { ...c, status: newStatus } : c
      ));
      alert("Complaint status updated successfully");
    } catch (err) {
      console.error("Error updating complaint:", err);
      alert("Failed to update complaint status");
    } finally {
      setResolvingComplaint(null);
    }
  };

  const generateReport = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/report/generate");
      if (!res.ok) throw new Error("Failed to generate report");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report");
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

  const filteredComplaints = complaints.filter(c =>
    filterStatus === "all" ? true : c.status === filterStatus
  );

  if (!user || loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-background">
        <div className="admin-content">
          {/* Header */}
          <header className="admin-header">
            <div className="admin-logo">
              <div className="admin-logo-icon">🛣️</div>
              <span className="admin-logo-text">CleanStreet</span>
            </div>

            <nav className="admin-nav">
              <button
                type="button"
                className="admin-nav-link"
                onClick={() => setActiveTab("overview")}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="admin-nav-link"
                onClick={() => setActiveTab("complaints")}
              >
                Report Issue
              </button>
              <button
                type="button"
                className="admin-nav-link"
                onClick={() => setActiveTab("manage")}
              >
                View Complaints
              </button>
              <button
                type="button"
                className="admin-nav-link"
                onClick={() => setActiveTab("admin")}
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

          {/* Admin Panel */}
          <main className="admin-main">
            <div className="admin-sidebar">
              <div className="admin-panel-title">Admin Panel</div>
              <div className="admin-menu">
                <button
                  className={`admin-menu-item ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <span className="admin-menu-icon">📊</span>
                  Overview
                </button>
                <button
                  className={`admin-menu-item ${activeTab === "manage" ? "active" : ""}`}
                  onClick={() => setActiveTab("manage")}
                >
                  <span className="admin-menu-icon">📋</span>
                  Manage Complaints
                </button>
                <button
                  className={`admin-menu-item ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  <span className="admin-menu-icon">👥</span>
                  Users
                </button>
                <button
                  className={`admin-menu-item ${activeTab === "reports" ? "active" : ""}`}
                  onClick={() => setActiveTab("reports")}
                >
                  <span className="admin-menu-icon">📈</span>
                  Reports
                </button>
              </div>
            </div>

            <div className="admin-content-area">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="admin-section">
                  <h2 className="admin-section-title">System Overview</h2>
                  
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">📋</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-value">{stats.totalComplaints}</div>
                        <div className="admin-stat-label">Total Complaints</div>
                      </div>
                    </div>

                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">⏳</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-value">{stats.pendingComplaints}</div>
                        <div className="admin-stat-label">Pending Review</div>
                      </div>
                    </div>

                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">👥</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-value">{stats.activeUsers}</div>
                        <div className="admin-stat-label">Active Users</div>
                      </div>
                    </div>

                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">✅</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-value">{stats.resolvedToday}</div>
                        <div className="admin-stat-label">Resolved Today</div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-impact-section">
                    <h3 className="admin-impact-title">Community Impact</h3>
                    <p className="admin-impact-text">
                      Thanks to citizen reports and community engagement, we've resolved 0 issues this month, making our city cleaner and safer for everyone.
                    </p>
                  </div>
                </div>
              )}

              {/* Manage Complaints Tab */}
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
                        <div key={complaint._id} className="admin-complaint-item">
                          <div className="admin-complaint-image">
                            <img
                              src={complaint.photo}
                              alt={complaint.title}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                          <div className="admin-complaint-details">
                            <h4 className="admin-complaint-title">{complaint.title}</h4>
                            <p className="admin-complaint-description">{complaint.description.substring(0, 100)}...</p>
                            <div className="admin-complaint-meta">
                              <span className="admin-complaint-category">{getCategoryLabel(complaint.category)}</span>
                              <span className="admin-complaint-date">
                                {new Date(complaint.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="admin-complaint-status">
                            <span
                              className="admin-status-badge"
                              style={{ backgroundColor: getStatusColor(complaint.status) }}
                            >
                              {getStatusLabel(complaint.status)}
                            </span>
                          </div>
                          <div className="admin-complaint-actions">
                            <select
                              value={complaint.status}
                              onChange={(e) => updateComplaintStatus(complaint._id, e.target.value)}
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

              {/* Users Tab */}
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
                            <td colSpan="5" className="admin-table-empty">No users found</td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr key={u._id}>
                              <td>{u.name}</td>
                              <td>{u.email}</td>
                              <td>{u.complaintCount || 0}</td>
                              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td>
                                <span className="admin-user-status active">Active</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="admin-section">
                  <h2 className="admin-section-title">Generate Reports</h2>
                  
                  <div className="admin-reports-grid">
                    <div className="admin-report-card">
                      <div className="admin-report-icon">📊</div>
                      <h3>System Report</h3>
                      <p>Complete system overview including complaints, users, and statistics</p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download PDF
                      </button>
                    </div>

                    <div className="admin-report-card">
                      <div className="admin-report-icon">📈</div>
                      <h3>Complaint Analytics</h3>
                      <p>Detailed analysis of complaints by category and status</p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download PDF
                      </button>
                    </div>

                    <div className="admin-report-card">
                      <div className="admin-report-icon">👥</div>
                      <h3>User Activity Report</h3>
                      <p>Monitor user activities and engagement metrics</p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download PDF
                      </button>
                    </div>

                    <div className="admin-report-card">
                      <div className="admin-report-icon">🗺️</div>
                      <h3>Geographic Distribution</h3>
                      <p>Issues mapped by location and category</p>
                      <button
                        className="admin-report-btn"
                        onClick={generateReport}
                      >
                        Download PDF
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
