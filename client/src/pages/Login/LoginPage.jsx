import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/LoginForm";
import Illustration from "../../components/Illustration";

export default function LoginPage({
  onGoToSignup,
  onForgotPassword,
  onLoginSuccess,
}) {
  return (
    <AuthLayout>
      <LoginForm
        onGoToSignup={onGoToSignup}
        onForgotPassword={onForgotPassword}
        onLoginSuccess={onLoginSuccess}
      />
      <Illustration />
    </AuthLayout>
  );
}
