import bg from "../assets/backgrounds/auth-bg.png";

export default function AuthLayout({ children }) {
  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="auth-wrapper">{children}</div>
    </div>
  );
}
