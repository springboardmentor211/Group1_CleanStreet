import { useState } from "react";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import OtpPage from "./pages/Otp/OtpPage";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import HomePage from "./pages/Home/HomePage";

function App() {
  const [mode, setMode] = useState("signup");

  if (mode === "home") {
    return <HomePage />;
  }

  if (mode === "login") {
    return (
      <LoginPage
        onGoToSignup={() => setMode("signup")}
        onForgotPassword={() => setMode("otp")}
        onLoginSuccess={() => setMode("home")}
      />
    );
  }

  if (mode === "otp") {
    return (
      <OtpPage
        onGoToReset={() => setMode("reset")}
        onBackToLogin={() => setMode("login")}
      />
    );
  }

  if (mode === "reset") {
    return <ResetPassword onBackToLogin={() => setMode("login")} />;
  }

  return <SignupPage onGoToLogin={() => setMode("login")} />;
}

export default App;
