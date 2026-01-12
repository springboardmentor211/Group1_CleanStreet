import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/LoginForm";
import Illustration from "../../components/Illustration";

export default function LoginPage({ onGoToSignup, onForgotPassword }) {
  return (
    <AuthLayout>
      <LoginForm
        onGoToSignup={onGoToSignup}
        onForgotPassword={onForgotPassword}
      />
      <Illustration />
    </AuthLayout>
  );
}
