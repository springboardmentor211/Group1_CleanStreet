import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { API_BASE } from "../utils/apiBase";

export default function LoginForm({
  onGoToSignup,
  onForgotPassword,
  onLoginSuccess,
  title = "Welcome Back!",
  subtitle = "Login to your account.",
  adminBadge = "",
  loginEndpoint = "/login",
}) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}${loginEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data?.message || "Invalid email or password", {
          type: "error",
        });
        setLoading(false);
        return;
      }

      if (!data.user || !data.user.id) {
        showToast("Invalid login response from server", { type: "error" });
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      showToast("Server error. Please try again.", { type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      {adminBadge ? <span className="auth-role-badge">{adminBadge}</span> : null}
      <h1>{title}</h1>
      <p>{subtitle}</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {showPassword ? (
                <>
                  <path
                    d="M1 1L23 23"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 5C7 5 3.73 8.11 2 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M12 5c5 0 8.27 3.11 10 7-1.73 3.89-5 7-10 7S3.73 15.89 2 12c1.73-3.89 5-7 10-7z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <span>Remember Me</span>
            <input type="checkbox" />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-footer">
        New here? <span onClick={onGoToSignup}>Sign up</span>
      </p>

      <p className="auth-footer">
        <span onClick={onForgotPassword}>Forgot Password?</span>
      </p>
    </div>
  );
}
