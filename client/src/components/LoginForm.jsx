export default function LoginForm() {
  return (
    <div className="auth-form">
      <h1>Join us to improve your City</h1>
      <p>Create your account and resolve local issues.</p>

      <form>
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <p className="auth-footer">
        Don’t have an account? <span>Sign up</span>
      </p>
    </div>
  );
}
