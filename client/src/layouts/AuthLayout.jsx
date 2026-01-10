import "../App.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">{children}</div>
    </div>
  );
}
