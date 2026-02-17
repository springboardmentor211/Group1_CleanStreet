import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/LoginForm";
import Illustration from "../../components/Illustration";
import AuthTopNavbar from "../../components/AuthTopNavbar";

export default function LoginPage({
  authRole = "user",
  onNavigate,
  onGoToSignup,
  onForgotPassword,
  onLoginSuccess,
}) {
  return (
    <AuthLayout
      topNav={
        <AuthTopNavbar
          variant="login"
          activeRole={authRole}
          onNavigate={onNavigate}
        />
      }
    >
      <LoginForm
        onGoToSignup={onGoToSignup}
        onForgotPassword={onForgotPassword}
        onLoginSuccess={onLoginSuccess}
      />
      <Illustration />
    </AuthLayout>
  );
}
