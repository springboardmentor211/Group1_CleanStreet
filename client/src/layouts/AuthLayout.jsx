import bg from "../assets/backgrounds/auth-bg.png";
import shadow from "../assets/illustrations/shadow.png";

export default function AuthLayout({ children, onNavigate }) {
  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Navbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1f2937",
        }}>
          🛣️ CleanStreet
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onNavigate && onNavigate("login")}
            style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Login as User
          </button>
          <button
            onClick={() => onNavigate && onNavigate("admin-login")}
            style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border: "none",
              background: "#4ade80",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Login as Admin
          </button>
        </div>
      </div>

      {/* Shadow decoration */}
      <div className="auth-shadow">
        <img src={shadow} alt="" />
      </div>

      {/* Content */}
      <div className="auth-wrapper">
        {children}
      </div>
    </div>
  );
}