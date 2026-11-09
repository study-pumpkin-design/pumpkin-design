import AuthHeading from "../auth/AuthHeading";
import AuthShell from "../auth/AuthShell";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <AuthShell mode="login">
      <AuthHeading
        title="Welcome back"
        description="Sign in to continue to your workspace."
      />
      <LoginForm />
    </AuthShell>
  );
}
