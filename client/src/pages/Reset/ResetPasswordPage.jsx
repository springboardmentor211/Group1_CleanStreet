import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";

export default function ResetPasswordPage({ onBackToLogin }) {
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
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showPassword ? (
                  <>
                    <path
                      d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.61859 9.35855 7.61859 9.99999C7.61859 11.3807 8.73887 12.5 10.1196 12.5C10.761 12.5 11.3442 12.2273 11.7862 11.7853M8.33333 8.33333L11.7862 11.7853M8.33333 8.33333L5.86905 5.86905M11.7862 11.7853L14.131 14.131M5.86905 5.86905C4.29893 6.98583 3.33333 8.90617 3.33333 11C3.33333 14.3333 6.66667 17.5 10 17.5C11.0938 17.5 12.1304 17.1818 13.0309 16.6309M5.86905 5.86905L2.5 2.5M14.131 14.131L17.5 17.5M14.131 14.131C15.3881 13.2955 16.4149 12.1212 17.0673 10.7424C16.2444 9.09274 14.1556 6.66666 10 6.66666C9.36364 6.66666 8.75758 6.75758 8.18182 6.90909"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M10 4.16666C13.9394 4.16666 17.0455 7.12121 17.7727 10C17.0455 12.8788 13.9394 15.8333 10 15.8333C6.06061 15.8333 2.95455 12.8788 2.22727 10C2.95455 7.12121 6.06061 4.16666 10 4.16666Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showNewPassword ? (
                  <>
                    <path
                      d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.61859 9.35855 7.61859 9.99999C7.61859 11.3807 8.73887 12.5 10.1196 12.5C10.761 12.5 11.3442 12.2273 11.7862 11.7853M8.33333 8.33333L11.7862 11.7853M8.33333 8.33333L5.86905 5.86905M11.7862 11.7853L14.131 14.131M5.86905 5.86905C4.29893 6.98583 3.33333 8.90617 3.33333 11C3.33333 14.3333 6.66667 17.5 10 17.5C11.0938 17.5 12.1304 17.1818 13.0309 16.6309M5.86905 5.86905L2.5 2.5M14.131 14.131L17.5 17.5M14.131 14.131C15.3881 13.2955 16.4149 12.1212 17.0673 10.7424C16.2444 9.09274 14.1556 6.66666 10 6.66666C9.36364 6.66666 8.75758 6.75758 8.18182 6.90909"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M10 4.16666C13.9394 4.16666 17.0455 7.12121 17.7727 10C17.0455 12.8788 13.9394 15.8333 10 15.8333C6.06061 15.8333 2.95455 12.8788 2.22727 10C2.95455 7.12121 6.06061 4.16666 10 4.16666Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
          <button type="submit">Reset Password</button>
        </form>

        <p className="auth-footer">
          <span onClick={onBackToLogin}>Back to Login</span>
        </p>
      </div>

      <Illustration useBuildings={true} />
    </AuthLayout>
  );
}

