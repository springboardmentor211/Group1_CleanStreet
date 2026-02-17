import { useEffect, useId, useState } from "react";
import logoIcon from "../assets/illustrations/13300e7a-6ca5-4b88-b861-9bd2d84036eb 5.png";

export default function AuthTopNavbar({ variant, activeRole, onNavigate }) {
  const [open, setOpen] = useState(false);
  const linksId = useId();

  const items =
    variant === "login"
      ? [
          { label: "Login as User", path: "/login", role: "user" },
          { label: "Login as Admin", path: "/admin/login", role: "admin" },
        ]
      : [
          { label: "Signup as User", path: "/signup", role: "user" },
          { label: "Signup as Admin", path: "/admin/signup", role: "admin" },
        ];

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavigate = (path) => {
    setOpen(false);
    if (typeof onNavigate === "function") onNavigate(path);
  };

  return (
    <header className="auth-top-nav">
      <div className="auth-top-nav__inner">
        <button
          type="button"
          className="auth-top-nav__brand"
          onClick={() => handleNavigate("/")}
        >
          <span className="auth-brand-wrapper">
            <span className="auth-brand-text">CleanStreet</span>
            <img
              src={logoIcon}
              alt="CleanStreet logo"
              className="auth-brand-icon"
            />
          </span>
        </button>

        <button
          type="button"
          className="auth-top-nav__hamburger"
          aria-controls={linksId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav
          id={linksId}
          className={`auth-top-nav__links ${open ? "is-open" : ""}`}
        >
          {items.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`auth-top-nav__link ${
                activeRole === item.role ? "is-active" : ""
              }`}
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
