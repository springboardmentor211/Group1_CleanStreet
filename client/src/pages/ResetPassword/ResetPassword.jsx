import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";

export default function ResetPassword({ onBackToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <AuthLayout>
      <div className="auth-form">
        <h1>Reset Your Password</h1>
        <p>Enter your new password below.</p>

        <form>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4.16666C13.9394 4.16666 17.0455 7.12121 17.7727 10C17.0455 12.8788 13.9394 15.8333 10 15.8333C6.06061 15.8333 2.95455 12.8788 2.22727 10C2.95455 7.12121 6.06061 4.16666 10 4.16666Z"
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
              </svg>
            </button>
          </div>

          <div className="password-input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4.16666C13.9394 4.16666 17.0455 7.12121 17.7727 10C17.0455 12.8788 13.9394 15.8333 10 15.8333C6.06061 15.8333 2.95455 12.8788 2.22727 10C2.95455 7.12121 6.06061 4.16666 10 4.16666Z"
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
              </svg>
            </button>
          </div>

          <button type="submit" className="signup-button">
            Reset Password
          </button>

          <p className="auth-footer">
            <span onClick={onBackToLogin}>Back to Login</span>
          </p>
        </form>
      </div>

      <Illustration />
    </AuthLayout>
  );
}
