import { useState, useEffect } from "react";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import AdminLoginPage from "./pages/AdminLogin/AdminLoginPage";
import AdminSignupPage from "./pages/AdminSignup/AdminSignupPage";
import OtpPage from "./pages/Otp/OtpPage";
import SignupOtpPage from "./pages/SignupOtp/SignupOtpPage";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import HomePage from "./pages/Home/HomePage";
import DashboardHomePage from "./pages/DashboardHome/DashboardHomePage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import NewReportPage from "./pages/NewReport/NewReportPage";
import CommunityMapPage from "./pages/CommunityMap/CommunityMapPage";
import CommunityReports from "./pages/CommunityReports/CommunityReports.jsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";

function normalizePathname(pathname) {
  if (!pathname || typeof pathname !== "string") return "/signup";
  if (pathname.length > 1 && pathname.endsWith("/"))
    return pathname.slice(0, -1);
  return pathname;
}

function modeFromPath(pathname) {
  const p = normalizePathname(pathname);

  if (p === "/otp") return "otp";
  if (p === "/reset") return "reset";
  if (p === "/signup/otp" || p === "/admin/signup/otp") return "signup-otp";
  if (p === "/login" || p === "/admin/login") return "login";
  if (p === "/signup" || p === "/admin/signup") return "signup";
  if (p === "/") return "home";
  if (p === "/my-complaints") return "my-complaints";
  if (p === "/profile") return "profile";
  if (p === "/new-report") return "new-report";
  if (p === "/community-map") return "community-map";
  if (p === "/community-reports") return "community-reports";
  if (p === "/landing") return "landing";
  if (p === "/admin/dashboard") return "admin-dashboard";
  if (p === "/admin/profile") return "admin-profile";

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
    return modeFromPath(window.location.pathname) ?? "signup";
  });

  const [pendingSignup, setPendingSignup] = useState(null);

  const navigate = (to, { replace = false } = {}) => {
    const next = normalizePathname(to);
    if (next === path) return;

    if (replace) {
      window.history.replaceState({}, "", next);
    } else {
      window.history.pushState({}, "", next);
    }

    setPath(next);

    // Persist admin path for later reloads
    if (next.startsWith('/admin/')) {
      localStorage.setItem('lastAdminPath', next);
    } else if (next === '/' || next === '/login' || next === '/signup') {
      // Clear stored admin path when navigating away from admin area
      localStorage.removeItem('lastAdminPath');
    }

    const nextMode = modeFromPath(next);
    if (nextMode) setMode(nextMode);
  };

  useEffect(() => {
    const onPopState = () => {
      const nextPath = normalizePathname(window.location.pathname);
      setPath(nextPath);

      const nextMode = modeFromPath(nextPath);
      if (nextMode) setMode(nextMode);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleNavigate = (newMode) => {
    // Map mode to URL path
    const modeToPath = {
      "login": "/login",
      "signup": "/signup",
      "home": "/",
      "my-complaints": "/my-complaints",
      "profile": "/profile",
      "new-report": "/new-report",
      "community-map": "/community-map",
      "community-reports": "/community-reports",
      "landing": "/landing",
    };

    const targetPath = modeToPath[newMode];
    if (targetPath) {
      navigate(targetPath);
    } else {
      // Fallback: just set mode if no path mapping exists
      setMode(newMode);
    }
  };

  const handleAdminNavigate = (newMode) => {
    const modeToPath = {
      login: "/admin/login",
      signup: "/admin/signup",
      "admin-dashboard": "/admin/dashboard",
      "admin-profile": "/admin/profile",
      home: "/",
      "my-complaints": "/my-complaints",
      profile: "/profile",
      "new-report": "/new-report",
      "community-map": "/community-map",
      "community-reports": "/community-reports",
      landing: "/landing",
    };

    const targetPath = modeToPath[newMode];
    if (targetPath) {
      navigate(targetPath);
      return;
    }

    handleNavigate(newMode);
  };

  // Restore admin path on initial load if present
  useEffect(() => {
    const savedAdminPath = localStorage.getItem('lastAdminPath');
    if (savedAdminPath && savedAdminPath !== path) {
      navigate(savedAdminPath, { replace: true });
    }
  }, []);

  const authRole = roleFromPath(path);
  const signupPath = authRole === "admin" ? "/admin/signup" : "/signup";
  const loginPath = authRole === "admin" ? "/admin/login" : "/login";

  if (mode === "login") {
    if (authRole === "admin") {
      return (
        <AdminLoginPage
          onNavigate={navigate}
          onGoToSignup={() => navigate("/admin/signup")}
          onForgotPassword={() => navigate("/otp")}
          onLoginSuccess={() => navigate("/admin/dashboard", { replace: true })}
        />
      );
    }

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

  if (mode === "signup") {
    if (authRole === "admin") {
      return (
        <AdminSignupPage
          onNavigate={navigate}
          onGoToLogin={() => navigate("/admin/login")}
          onGoToOtp={(pending) => {
            setPendingSignup(pending);
            navigate("/admin/signup/otp");
          }}
        />
      );
    }

    return (
      <SignupPage
        authRole={authRole}
        onNavigate={navigate}
        onGoToLogin={() => navigate(loginPath)}
        onGoToOtp={(pending) => {
          setPendingSignup(pending);
          navigate("/signup/otp");
        }}
      />
    );
  }

  if (mode === "signup-otp" && pendingSignup) {
    const otpRole = roleFromPath(path);
    return (
      <SignupOtpPage
        signupData={pendingSignup.data}
        signupEndpoint={pendingSignup.endpoint}
        authRole={otpRole}
        onNavigate={navigate}
        onVerified={() => {
          setPendingSignup(null);
          const loginTarget =
            otpRole === "admin" ? "/admin/login" : "/login";
          navigate(loginTarget);
        }}
        onBack={() => {
          const signupTarget =
            otpRole === "admin" ? "/admin/signup" : "/signup";
          navigate(signupTarget);
        }}
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

  // ========= MAIN APP ROUTES =========

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

  if (mode === "admin-dashboard") {
    return <AdminDashboardPage onNavigate={handleAdminNavigate} />;
  }

  if (mode === "admin-profile") {
    return <AdminProfilePage onNavigate={handleAdminNavigate} />;
  }

  return (
    <SignupPage
      authRole={authRole}
      onNavigate={navigate}
      onGoToLogin={() => navigate(loginPath)}
    />
  );
}

export default App;
