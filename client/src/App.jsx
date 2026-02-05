import { useState, useEffect } from "react";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import OtpPage from "./pages/Otp/OtpPage";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import HomePage from "./pages/Home/HomePage";
import DashboardHomePage from "./pages/DashboardHome/DashboardHomePage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import NewReportPage from "./pages/NewReport/NewReportPage";
import CommunityMapPage from "./pages/CommunityMap/CommunityMapPage";
import CommunityReports from "./pages/CommunityReports/CommunityReports.jsx";


function App() {
  const [mode, setMode] = useState("signup");

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user && mode === "signup") {
      setMode("home");
    }
    // setMode("community-reports");
  }, [mode]);

  const handleNavigate = (newMode) => {
    setMode(newMode);
  };

  if (mode === "home") {
    return <DashboardHomePage onNavigate={handleNavigate} />;
  }

  if (mode === "my-complaints") {
    return <DashboardPage onNavigate={handleNavigate} />;
  }

  if (mode === "profile") {
    return <ProfilePage onNavigate={handleNavigate} />;
  }

  if (mode === "new-report") {
    return <NewReportPage onNavigate={handleNavigate} />;
  }

  if (mode === "community-map") {
    return <CommunityMapPage onNavigate={handleNavigate} />;
  }

  if (mode === "landing") {
    return <HomePage onNavigate={handleNavigate} />;
  }

  if (mode === "community-reports") {
    return <CommunityReports onNavigate={handleNavigate} />;
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
