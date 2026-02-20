import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/LoginForm";
import Illustration from "../../components/Illustration";
import AuthTopNavbar from "../../components/AuthTopNavbar";

export default function AdminLoginPage({
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
          activeRole="admin"
          onNavigate={onNavigate}
        />
      }
    >
      <LoginForm
        onGoToSignup={onGoToSignup}
        onForgotPassword={onForgotPassword}
        onLoginSuccess={onLoginSuccess}
        title="Login as Admin"
        subtitle="Access the administrative dashboard and moderation controls."
        adminBadge="Administrator Access"
        loginEndpoint="/admin/login"
      />
      <Illustration />
    </AuthLayout>
  );
}
