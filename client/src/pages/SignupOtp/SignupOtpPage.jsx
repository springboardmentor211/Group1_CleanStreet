import { useState, useRef, useEffect } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Illustration from "../../components/Illustration";
import AuthTopNavbar from "../../components/AuthTopNavbar";
import { useToast } from "../../context/ToastContext";
import { API_BASE } from "../../utils/apiBase";
import "./SignupOtp.css";

export default function SignupOtpPage({
    signupData,
    signupEndpoint,
    authRole = "user",
    onNavigate,
    onVerified,
    onBack,
}) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [verifying, setVerifying] = useState(false);
    const inputsRef = useRef([]);
    const boxes = Array.from({ length: 6 });

    // Countdown timer for resend
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        e.target.value = value;

        // Add bounce animation
        if (value) {
            e.target.classList.remove("signup-otp-bounce");
            void e.target.offsetWidth; // force reflow
            e.target.classList.add("signup-otp-bounce");
        }

        if (value && index < boxes.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        paste.split("").forEach((char, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i].value = char;
                inputsRef.current[i].classList.add("signup-otp-bounce");
            }
        });
        const nextIndex = Math.min(paste.length, boxes.length - 1);
        inputsRef.current[nextIndex]?.focus();
    };

    const getOtpValue = () =>
        inputsRef.current.map((input) => input?.value || "").join("");

    const handleVerify = async () => {
        const otp = getOtpValue();
        if (otp.length !== 6) {
            showToast("Please enter the complete 6-digit OTP.", { type: "error" });
            return;
        }

        setVerifying(true);

        try {
            // Step 1: Verify OTP
            const verifyRes = await fetch(`${API_BASE}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: signupData.email, otp }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                showToast(verifyData.message || "OTP verification failed.", { type: "error" });
                setVerifying(false);
                return;
            }

            // Step 2: Create the account
            const signupRes = await fetch(`${API_BASE}${signupEndpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const signupResult = await signupRes.json();

            if (!signupRes.ok) {
                showToast(signupResult.message || "Signup failed.", { type: "error" });
                setVerifying(false);
                return;
            }

            showToast("Account created successfully!", { type: "success" });
            onVerified();
        } catch (err) {
            showToast("Server error. Please try again.", { type: "error" });
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: signupData.email }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast("New OTP sent to your email!", { type: "success" });
                setResendCooldown(30);
                // Clear existing inputs
                inputsRef.current.forEach((input) => {
                    if (input) input.value = "";
                });
                inputsRef.current[0]?.focus();
            } else {
                showToast(data.message || "Failed to resend OTP.", { type: "error" });
            }
        } catch (err) {
            showToast("Server error. Please try again.", { type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const maskedEmail = signupData?.email
        ? signupData.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
        : "";

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
            <div className="auth-form signup-otp-form">
                {authRole === "admin" && (
                    <span className="auth-role-badge">Administrator Onboarding</span>
                )}
                <h1>Verify Your Email</h1>
                <p>We've sent a 6-digit verification code to your email.</p>

                <p className="signup-otp-subtext">
                    Enter the code sent to: <span className="signup-otp-email">{maskedEmail}</span>
                </p>

                <div className="signup-otp-inputs" onPaste={handlePaste}>
                    {boxes.map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="signup-otp-box"
                            style={{ animationDelay: `${index * 0.08}s` }}
                            ref={(el) => (inputsRef.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            disabled={verifying}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="signup-button signup-otp-verify-btn"
                    onClick={handleVerify}
                    disabled={verifying}
                >
                    {verifying ? "Verifying..." : "Verify & Create Account"}
                </button>

                <p className="signup-otp-footer">
                    Didn&apos;t receive the code?{" "}
                    {resendCooldown > 0 ? (
                        <span className="signup-otp-cooldown">
                            Resend in {resendCooldown}s
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="link-button"
                            onClick={handleResend}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Resend OTP"}
                        </button>
                    )}
                </p>

                <button
                    type="button"
                    className="link-button signup-otp-back"
                    onClick={onBack}
                    disabled={verifying}
                >
                    ← Back to Sign Up
                </button>
            </div>

            <Illustration />
        </AuthLayout>
    );
}
