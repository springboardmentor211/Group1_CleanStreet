import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/LoginForm";
import Illustration from "../../components/Illustration";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
      <Illustration />
    </AuthLayout>
  );
}
