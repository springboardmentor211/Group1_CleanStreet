import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";

export default function SignupPage({ onGoToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout>
      <div className="auth-form signup-form">
        <h1>Join us to improve your City</h1>
        <p>Create your account and resolve local issues.</p>

        <form>
          <input
            type="text"
            placeholder="Full Name"
            className="signup-input"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="signup-input"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="signup-input"
            required
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="signup-input"
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

          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="signup-input"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {showConfirmPassword ? (
                  <path
                    d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.61859 9.35855 7.61859 9.99999"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <>
                    <path
                      d="M10 4.16666C13.9394 4.16666 17.0455 7.12121 17.7727 10"
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

          <div className="signup-terms">
            <label>
              <input type="checkbox" required />
              <span>I agree to the Terms & Condition.</span>
            </label>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <p className="auth-footer">
            Already have an account? <span onClick={onGoToLogin}>Login</span>
          </p>
        </form>
      </div>

      <Illustration />
    </AuthLayout>
  );
}
