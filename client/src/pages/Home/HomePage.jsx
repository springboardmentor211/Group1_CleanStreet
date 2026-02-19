import buildings from "../../assets/illustrations/buildings.jpg";

export default function HomePage({ onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%)", fontFamily: "Arial, sans-serif" }}>

      {/* Navbar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 40px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ fontWeight: "bold", fontSize: "18px", color: "#1f2937" }}>
          🛣️ CleanStreet
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onNavigate("login")}
            style={{
              padding: "7px 20px",
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
            onClick={() => onNavigate("admin-login")}
            style={{
              padding: "7px 20px",
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
      </header>

      {/* Hero Section */}
      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 80px",
        gap: "40px",
        flexWrap: "wrap",
      }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "520px" }}>
          <p style={{ color: "#16a34a", fontWeight: "600", fontSize: "14px", marginBottom: "12px" }}>
            Clean Street: Simplifying Civic Issue Reporting.
          </p>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", color: "#1f2937", lineHeight: 1.2, marginBottom: "16px" }}>
            Report public issues{" "}
            <span style={{ color: "#16a34a" }}>in seconds</span>.
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.7, marginBottom: "32px" }}>
            Report issues like garbage dumps, potholes, water leakage, and
            broken streetlights in your community and track their resolution in real time.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
            <button
              onClick={() => onNavigate("signup")}
              style={{
                padding: "12px 28px",
                borderRadius: "999px",
                border: "none",
                background: "#16a34a",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate("login")}
              style={{
                padding: "12px 28px",
                borderRadius: "999px",
                border: "2px solid #16a34a",
                background: "transparent",
                color: "#16a34a",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Issue Reports", value: "5,200+" },
              { label: "Issues Fixed", value: "3,800+" },
              { label: "Active Volunteers", value: "120+" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "white",
                borderRadius: "12px",
                padding: "14px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                minWidth: "100px",
              }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Illustration */}
        <div style={{ flex: 1, minWidth: "280px", maxWidth: "500px", display: "flex", justifyContent: "center" }}>
          <img
            src={buildings}
            alt="CleanStreet Illustration"
            style={{
              width: "100%",
              maxWidth: "460px",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              objectFit: "cover",
            }}
          />
        </div>
      </main>

      {/* How It Works */}
      <section style={{ padding: "60px 80px", background: "rgba(255,255,255,0.5)" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", color: "#1f2937", marginBottom: "40px" }}>
          How It Works
        </h2>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "📷", title: "Report Issues", desc: "Snap photos and report issues with precise location details in just a few taps." },
            { icon: "📊", title: "Track Progress", desc: "Monitor the status of reported issues and see how your community is improving." },
            { icon: "🔔", title: "Get Updates", desc: "Receive updates from authorities or volunteers as issues are reviewed and resolved." },
          ].map((card) => (
            <div key={card.title} style={{
              background: "white",
              borderRadius: "16px",
              padding: "32px 24px",
              maxWidth: "280px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{card.icon}</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1f2937", marginBottom: "10px" }}>{card.title}</h3>
              <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}