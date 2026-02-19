export default function AdminLayout({ children, onNavigate, activePage }) {
  const logout = () => {
    localStorage.removeItem("admin");
    onNavigate("admin-login");
  };

  const navItems = [
    { label: "Overview", icon: "📊", page: "admin-dashboard" },
    { label: "Manage Complaints", icon: "📋", page: "admin-reports" },
    { label: "Users", icon: "👥", page: "admin-users" },
    { label: "Reports", icon: "📈", page: "admin-analytics" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Inter, Arial, sans-serif", background: "#f0f4ff" }}>

      {/* Top Navbar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontWeight: "800", fontSize: "18px", color: "#4f46e5" }}>
          🛣️ CleanStreet
        </div>
        <nav style={{ display: "flex", gap: "28px" }}>
          {["Dashboard", "Report Issue", "View Complaints"].map((item) => (
            <span key={item} style={{ fontSize: "14px", color: "#6b7280", cursor: "pointer", fontWeight: "500" }}>
              {item}
            </span>
          ))}
          <span style={{ fontSize: "14px", color: "#4f46e5", cursor: "pointer", fontWeight: "600" }}>
            Admin
          </span>
        </nav>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onNavigate("login")}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Login
          </button>
          <button
            onClick={logout}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#4f46e5",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              color: "white",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <aside style={{
          width: "200px",
          background: "white",
          borderRight: "1px solid #e5e7eb",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            padding: "0 8px",
          }}>
            <span style={{ fontSize: "18px" }}>🛡️</span>
            <span style={{ fontWeight: "700", fontSize: "14px", color: "#1f2937" }}>Admin Panel</span>
          </div>

          {navItems.map((item) => (
            <div
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: activePage === item.page ? "600" : "500",
                background: activePage === item.page ? "#ede9fe" : "transparent",
                color: activePage === item.page ? "#4f46e5" : "#6b7280",
                transition: "all 0.15s",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>

      </div>
    </div>
  );
}