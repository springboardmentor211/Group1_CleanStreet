import { useState } from "react";

export default function LoginForm({
  onGoToSignup,
  onForgotPassword,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Please recheck email and password");
        return;
      }

      if (onLoginSuccess) onLoginSuccess();
    } catch {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      <h1>Welcome Back!</h1>
      <p>Login to your account.</p>

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

        {/* ✅ SAME LINE — checkbox on RIGHT */}
        <div className="form-options">
          <label className="remember-me">
            <span>Remember Me</span>
            <input type="checkbox" />
          </label>
        </div>

        <button type="submit">Login</button>
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
