import bg from "../assets/backgrounds/auth-bg.png";
import shadow from "../assets/illustrations/shadow.png";

export default function AuthLayout({ topNav, children }) {
  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {topNav}

      <div className="auth-shadow">
        <img src={shadow} alt="" />
      </div>

      <div className="auth-wrapper">{children}</div>
    </div>
  );
}
