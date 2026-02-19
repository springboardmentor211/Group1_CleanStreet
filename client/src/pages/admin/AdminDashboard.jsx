import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { API_BASE } from "../../utils/apiBase";

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingReview: 0,
    activeUsers: 0,
    resolvedToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/stats`);
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch {
        // use default zeros if API fails
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: "📋", label: "Total Complaints", value: stats.totalComplaints, color: "#4f46e5", bg: "#ede9fe" },
    { icon: "👥", label: "Pending Review",   value: stats.pendingReview,   color: "#0891b2", bg: "#e0f2fe" },
    { icon: "📊", label: "Active Users",     value: stats.activeUsers,     color: "#16a34a", bg: "#dcfce7" },
    { icon: "✅", label: "Resolved Today",   value: stats.resolvedToday,   color: "#ea580c", bg: "#ffedd5" },
  ];

  return (
    <AdminLayout onNavigate={onNavigate} activePage="admin-dashboard">

      <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#1f2937", marginBottom: "24px" }}>
        System Overview
      </h1>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: "white",
            borderRadius: "14px",
            padding: "24px 20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: card.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}>
              {card.icon}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: card.color }}>
              {card.value.toLocaleString()}
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500", textAlign: "center" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Community Impact */}
      <div style={{
        background: "white",
        borderRadius: "14px",
        padding: "28px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        marginBottom: "24px",
      }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1f2937", marginBottom: "10px" }}>
          Community Impact
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.7 }}>
          Thanks to citizen reports and community engagement, we've resolved{" "}
          <span style={{ color: "#4f46e5", fontWeight: "700" }}>{stats.resolvedToday}</span>{" "}
          issues this month, making our city cleaner and safer for everyone.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: "white",
        borderRadius: "14px",
        padding: "28px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1f2937", marginBottom: "16px" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => onNavigate("admin-reports")}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              border: "none",
              background: "#4f46e5",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            📋 Manage Complaints
          </button>
          <button
            onClick={() => onNavigate("admin-users")}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              color: "#374151",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            👥 View Users
          </button>
          <button
            onClick={() => onNavigate("admin-analytics")}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              color: "#374151",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            📈 View Reports
          </button>
        </div>
      </div>

    </AdminLayout>
  );
}