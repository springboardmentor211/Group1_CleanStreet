import SignupPage from "../Signup/SignupPage";

export default function AdminSignupPage({ onNavigate, onGoToLogin, onGoToOtp }) {
  return (
    <SignupPage
      authRole="admin"
      onNavigate={onNavigate}
      onGoToLogin={onGoToLogin}
      onGoToOtp={onGoToOtp}
      title="Signup as Admin"
      subtitle="Create an admin account to manage reports and community operations."
      adminBadge="Administrator Onboarding"
      signupEndpoint="/admin/signup"
      signupRole="admin"
    />
  );
}
