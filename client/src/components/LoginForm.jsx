import { useState } from "react";

export default function LoginForm({ onGoToSignup, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Invalid email or password");
    } else {
      alert("Successfully logged in");
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
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {showPassword ? (
                <path
                  d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.61859 9.35855 7.61859 9.99999C7.61859 11.3807 8.73887 12.5 10.1196 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path
                    d="M10 4.16666C13.9394 4.16666 17.0455 7.12121 17.7727 10C17.0455 12.8788 13.9394 15.8333 10 15.8333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>
          <span className="forgot-password" onClick={onForgotPassword}>
            Forgot Password?
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className="auth-footer">
        New here? <span onClick={onGoToSignup}>Sign up</span>
      </p>
    </div>
  );
}
