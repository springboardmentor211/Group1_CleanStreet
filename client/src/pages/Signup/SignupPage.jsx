import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";
import "../../App.css";

export default function SignupPage({ onGoToLogin }) {
  return (
    <AuthLayout>
      <div className="signup-form">
        <h1>Join us to improve your City</h1>
        <p>Create your account and resolve local issues.</p>

        <form>
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="signup-terms">
            <label>
              <input type="checkbox" required />{" "}
              <span>
                I agree to the <span className="link">Terms &amp; Condition.</span>
              </span>
            </label>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <div className="auth-footer">
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={onGoToLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>

      <Illustration />
    </AuthLayout>
  );
}

