import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout.jsx";

export default function AdminLoginPage({ onGoToAdminSignup, onAdminLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed");
      localStorage.setItem("admin", JSON.stringify(data.admin));
      if (onAdminLoginSuccess) onAdminLoginSuccess();
    } catch {
      alert("Server error.");
    }
  };

  return (
    <AuthLayout onNavigate={onNavigate}>
      <div className="auth-form">
        <h1>Admin Login</h1>
        <p>Login to your admin account.</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="auth-footer">
          Don't have an admin account?{" "}
          <span style={{ cursor: "pointer", color: "#2563eb" }} onClick={onGoToAdminSignup}>
            Sign up here
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}