import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout.jsx";

export default function AdminSignupPage({ onGoToAdminLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Signup failed");
      alert("Admin registered successfully!");
      if (onGoToAdminLogin) onGoToAdminLogin();
    } catch {
      alert("Server error.");
    }
  };

  return (
    <AuthLayout onNavigate={onNavigate}>
      <div className="auth-form">
        <h1>Admin Signup</h1>
        <p>Create your admin account.</p>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Register</button>
        </form>
        <p className="auth-footer">
          Already an admin?{" "}
          <span style={{ cursor: "pointer", color: "#2563eb" }} onClick={onGoToAdminLogin}>
            Login here
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}