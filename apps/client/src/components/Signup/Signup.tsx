import AuthHeading from "../auth/AuthHeading";
import AuthShell from "../auth/AuthShell";
import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <AuthShell mode="signup">
      <AuthHeading
        compact
        title="Create your account"
        description="A few details and your workspace is ready."
      />
      <SignupForm />
    </AuthShell>
  );
}
