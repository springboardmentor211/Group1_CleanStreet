import LoginForm from "../../components/LoginForm.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";

export default function LoginPage({ onGoToSignup, onForgotPassword, onLoginSuccess, onNavigate }) {
  return (
    <AuthLayout onNavigate={onNavigate}>
      <LoginForm
        onGoToSignup={onGoToSignup}
        onForgotPassword={onForgotPassword}
        onLoginSuccess={onLoginSuccess}
      />
    </AuthLayout>
  );
}