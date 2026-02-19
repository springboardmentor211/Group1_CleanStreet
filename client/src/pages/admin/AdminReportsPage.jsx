import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { API_BASE } from "../../utils/apiBase";

export default function AdminReportsPage({ onNavigate }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/reports`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setReports(data.reports || []);
      } catch {
        alert("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to update");

      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch {
      alert("Server error.");
    }
  };

  return (
    <AdminLayout onNavigate={onNavigate}>
      <h1 style={{ marginBottom: "20px" }}>Manage Complaints</h1>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
          <thead>
            <tr style={{ background: "#e5e7eb" }}>
              <th style={th}>Title</th>
              <th style={th}>Location</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={td}>{report.title}</td>
                <td style={td}>{report.location}</td>
                <td style={td}>{report.status}</td>
                <td style={td}>
                  <select
                    value={report.status}
                    onChange={(e) => updateStatus(report._id, e.target.value)}
                    style={{ padding: "4px 8px" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}

const th = { padding: "12px", textAlign: "left", fontWeight: "bold" };
const td = { padding: "12px" };