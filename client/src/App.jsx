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

function normalizePathname(pathname) {
  if (!pathname || typeof pathname !== "string") return "/signup";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function modeFromPath(pathname, hasUser) {
  const p = normalizePathname(pathname);

  if (p === "/otp") return "otp";
  if (p === "/reset") return "reset";
  if (p === "/login" || p === "/admin/login") return "login";
  if (p === "/signup" || p === "/admin/signup") return "signup";
  if (p === "/") return hasUser ? "home" : "signup";

  return null;
}

function roleFromPath(pathname) {
  return normalizePathname(pathname).startsWith("/admin/") ? "admin" : "user";
}

function App() {
  const [path, setPath] = useState(() =>
    normalizePathname(window.location.pathname),
  );
  const [mode, setMode] = useState(() => {
    const hasUser = Boolean(localStorage.getItem("user"));
    return modeFromPath(window.location.pathname, hasUser) ?? "signup";
  });

  const navigate = (to, { replace = false } = {}) => {
    const next = normalizePathname(to);
    if (next === path) return;
    if (replace) {
      window.history.replaceState({}, "", next);
    } else {
      window.history.pushState({}, "", next);
    }
    setPath(next);

    const hasUser = Boolean(localStorage.getItem("user"));
    const nextMode = modeFromPath(next, hasUser);
    if (nextMode) setMode(nextMode);
  };

  useEffect(() => {
    const onPopState = () => {
      const nextPath = normalizePathname(window.location.pathname);
      setPath(nextPath);

      const hasUser = Boolean(localStorage.getItem("user"));
      const nextMode = modeFromPath(nextPath, hasUser);
      if (nextMode) setMode(nextMode);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user && (mode === "signup" || mode === "login")) {
      if (path !== "/") {
        window.history.replaceState({}, "", "/");
        setPath("/");
      }
      setMode("home");
    }
  }, [mode, path]);

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

  const authRole = roleFromPath(path);
  const signupPath = authRole === "admin" ? "/admin/signup" : "/signup";
  const loginPath = authRole === "admin" ? "/admin/login" : "/login";

  if (mode === "login") {
    return (
      <LoginPage
        authRole={authRole}
        onNavigate={navigate}
        onGoToSignup={() => navigate(signupPath)}
        onForgotPassword={() => navigate("/otp")}
        onLoginSuccess={() => navigate("/", { replace: true })}
      />
    );
  }

  if (mode === "otp") {
    return (
      <OtpPage
        onGoToReset={() => navigate("/reset")}
        onBackToLogin={() => navigate("/login")}
      />
    );
  }

  if (mode === "reset") {
    return <ResetPassword onBackToLogin={() => navigate("/login")} />;
  }

  return <SignupPage authRole={authRole} onNavigate={navigate} onGoToLogin={() => navigate(loginPath)} />;
}

export default App;
