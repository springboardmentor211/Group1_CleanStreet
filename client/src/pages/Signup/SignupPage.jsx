import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";

export default function SignupPage({ onGoToLogin, onGoToAdminLogin, onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("Signup successful");
        onGoToLogin();
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Build a combined navigate handler
  const handleNavigate = (mode) => {
    if (mode === "login" && onGoToLogin) onGoToLogin();
    else if (mode === "admin-login" && onGoToAdminLogin) onGoToAdminLogin();
    else if (onNavigate) onNavigate(mode);
  };

  return (
    <AuthLayout onNavigate={handleNavigate}>
      <div className="auth-form signup-form">
        <h1>Join us to improve your City</h1>
        <p>Create your account and resolve local issues.</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              👁
            </button>
          </div>

          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              👁
            </button>
          </div>

          <div className="signup-terms" style={{ marginBottom: "-8px" }}>
          <label>
          <input type="checkbox" required disabled={loading} />
          <span>I agree to the Terms & Condition.</span>
          </label>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="auth-footer" style={{ marginTop: "-8px" }}>
                    Already have an account?{" "}
              <span onClick={!loading ? onGoToLogin : undefined}>Login</span>
          </p>
        </form>
      </div>

      <Illustration />
    </AuthLayout>
  );
}