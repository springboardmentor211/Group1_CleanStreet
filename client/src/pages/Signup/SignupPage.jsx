import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";
import AuthTopNavbar from "../../components/AuthTopNavbar";
import { useToast } from "../../context/ToastContext";
import { API_BASE } from "../../utils/apiBase";

export default function SignupPage({
  authRole = "user",
  onNavigate,
  onGoToLogin,
  onGoToOtp,
  title = "Join us to improve your City",
  subtitle = "Create your account and resolve local issues.",
  adminBadge = "",
  signupEndpoint = "/signup",
  signupRole = "user",
}) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const getPasswordValidationError = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Za-z]/.test(value)) return "Password must include at least 1 letter.";
    if (!/\d/.test(value)) return "Password must include at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must include at least 1 symbol.";
    }
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      showToast(passwordError, { type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      // Send OTP to the user's email first
      const otpRes = await fetch(`${API_BASE}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        showToast(otpData.message || "Failed to send OTP.", { type: "error" });
      } else {
        showToast("OTP sent to your email!", { type: "success" });
        // Navigate to OTP verification page with signup data
        if (onGoToOtp) {
          onGoToOtp({
            data: { name, email, phone, password, role: signupRole },
            endpoint: signupEndpoint,
          });
        }
      }
    } catch (err) {
      showToast("Server error. Please try again.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      topNav={
        <AuthTopNavbar
          variant="signup"
          activeRole={authRole}
          onNavigate={onNavigate}
        />
      }
    >
      <div className="auth-form signup-form">
        {adminBadge ? <span className="auth-role-badge">{adminBadge}</span> : null}
        <h1>{title}</h1>
        <p>{subtitle}</p>

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

          {/* Password */}
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                /* Eye Off */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9-7-9-7a21.77 21.77 0 0 1 5.06-5.94" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                /* Eye */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <p className="auth-password-hint">
            Use at least 8 characters with 1 letter, 1 number, and 1 symbol.
          </p>

          {/* Confirm Password */}
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={loading}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9-7-9-7a21.77 21.77 0 0 1 5.06-5.94" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="signup-terms">
            <label>
              <input type="checkbox" required disabled={loading} />
              <span>I agree to the Terms & Condition.</span>
            </label>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="auth-footer">
            Already have an account?{" "}
            <span onClick={!loading ? onGoToLogin : undefined}>Login</span>
          </p>
        </form>
      </div>

      <Illustration />
    </AuthLayout>
  );
}
