import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext({ showToast: () => {} });

function getThemeFromPath(pathname) {
  const authPaths = new Set(["/login", "/signup", "/otp", "/reset", "/admin/login", "/admin/signup"]);
  return authPaths.has(pathname) ? "auth" : "app";
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    if (!message) return;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = options.duration ?? 3500;
    const type = options.type || "info";
    const theme = options.theme || getThemeFromPath(window.location.pathname);

    setToasts((prev) => [...prev, { id, message, type, theme }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-root" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-message toast-${toast.type} toast-theme-${toast.theme}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
