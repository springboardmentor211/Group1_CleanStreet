import { useRef } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";

export default function OtpPage({ onGoToReset, onBackToLogin }) {
  const inputsRef = useRef([]);
  const boxes = Array.from({ length: 6 });

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;

    if (value && index < boxes.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const otp = inputsRef.current.map((input) => input?.value || "");
    const isComplete = otp.every((value) => value.length === 1);

    if (isComplete) {
      onGoToReset();
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form otp-form">
        <h1>OTP Verification</h1>
        <p>Enter the OTP sent to your phone.</p>

        <p className="otp-subtext">
          Enter the 6-digit sent to: <span>+91 0000000000</span>
        </p>

        <div className="otp-inputs">
          {boxes.map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="otp-input"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="signup-button otp-button"
          onClick={handleConfirm}
        >
          Confirm OTP
        </button>

        <p className="otp-footer">
          Didn&apos;t receive the code?{" "}
          <button type="button" className="link-button">
            Resend OTP
          </button>
        </p>

        <button
          type="button"
          className="link-button otp-back"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>
      </div>

      <Illustration useBuildings />
    </AuthLayout>
  );
}
