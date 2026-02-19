import { useState, useEffect } from "react";
import LoginPage from "./pages/Login/LoginPage.jsx";
import SignupPage from "./pages/Signup/SignupPage.jsx";
import OtpPage from "./pages/Otp/OtpPage.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import DashboardHomePage from "./pages/DashboardHome/DashboardHomePage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import NewReportPage from "./pages/NewReport/NewReportPage.jsx";
import CommunityMapPage from "./pages/CommunityMap/CommunityMapPage.jsx";
import TrackCommunityIssues from "./TrackCommunityIssues.jsx";

import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminSignupPage from "./pages/admin/AdminSignupPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminReportsPage from "./pages/admin/AdminReportsPage.jsx";

function App() {
  const [mode, setMode] = useState("signup");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && mode === "signup") {
      setMode("home");
    }
  }, [mode]);

  const handleNavigate = (newMode) => {
    setMode(newMode);
  };

  // ----------------- ADMIN FLOWS -----------------
  if (mode === "admin-login")
    return (
      <AdminLoginPage
        onGoToAdminSignup={() => setMode("admin-signup")}
        onAdminLoginSuccess={() => setMode("admin-dashboard")}
        onNavigate={handleNavigate}
      />
    );

  if (mode === "admin-signup")
    return (
      <AdminSignupPage
        onGoToAdminLogin={() => setMode("admin-login")}
        onNavigate={handleNavigate}
      />
    );

  if (mode === "admin-dashboard")
    return <AdminDashboard onNavigate={handleNavigate} />;

  if (mode === "admin-reports")
    return <AdminReportsPage onNavigate={handleNavigate} />;

  // ----------------- USER FLOWS -----------------
  if (mode === "home") return <DashboardHomePage onNavigate={handleNavigate} />;
  if (mode === "my-complaints") return <DashboardPage onNavigate={handleNavigate} />;
  if (mode === "profile") return <ProfilePage onNavigate={handleNavigate} />;
  if (mode === "new-report") return <NewReportPage onNavigate={handleNavigate} />;
  if (mode === "community-map") return <CommunityMapPage onNavigate={handleNavigate} />;
  if (mode === "landing") return <HomePage onNavigate={handleNavigate} />;
  if (mode === "community-reports")
    return <TrackCommunityIssues onNavigate={handleNavigate} />;

  if (mode === "login")
    return (
      <LoginPage
        onGoToSignup={() => setMode("signup")}
        onForgotPassword={() => setMode("otp")}
        onLoginSuccess={() => setMode("home")}
        onNavigate={handleNavigate}
      />
    );

  if (mode === "otp")
    return (
      <OtpPage
        onGoToReset={() => setMode("reset")}
        onBackToLogin={() => setMode("login")}
      />
    );

  if (mode === "reset")
    return <ResetPassword onBackToLogin={() => setMode("login")} />;

  // Default fallback — Signup Page
  return (
    <SignupPage
      onGoToLogin={() => setMode("login")}
      onGoToAdminLogin={() => setMode("admin-login")}
      onNavigate={handleNavigate}
    />
  );
}

export default App;