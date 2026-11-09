"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authRequest } from "@/lib/auth";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import FormNotice from "../auth/FormNotice";
import PasswordField from "../auth/PasswordField";
import TextField from "../auth/TextField";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authRequest("/auth/sign-up", {
        email: email.trim(),
        username: username.trim(),
        password,
      });
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <TextField
        id="signup-email"
        label="Work email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
      />
      <TextField
        id="username"
        label="Username"
        autoComplete="username"
        value={username}
        onChange={setUsername}
        placeholder="Choose a username"
      />
      <PasswordField
        id="signup-password"
        label="Password"
        hint="8+ characters"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
      />
      {error ? <FormNotice>{error}</FormNotice> : null}
      <AuthSubmitButton disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </AuthSubmitButton>
      <p className="pt-1 text-center text-xs leading-5 text-[#706b78]">
        By continuing, you agree to use Pumpkin Design responsibly.{" "}
        <Link
          href="/login"
          className="font-semibold text-[#302a37] underline decoration-custom-purple underline-offset-2"
        >
          Already have an account?
        </Link>
      </p>
    </form>
  );
}
