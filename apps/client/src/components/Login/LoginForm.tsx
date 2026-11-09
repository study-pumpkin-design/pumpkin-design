"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authRequest } from "@/lib/auth";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import FormNotice from "../auth/FormNotice";
import PasswordField from "../auth/PasswordField";
import TextField from "../auth/TextField";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authRequest("/auth/login", { email: email.trim(), password });
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t sign you in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
      />
      <div className="space-y-2">
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        <Link
          href={{
            pathname: "/forgot-password",
            query: email.trim() ? { email: email.trim() } : {},
          }}
          className="inline-flex rounded-md text-sm font-semibold text-[#5c3b70] underline decoration-custom-purple decoration-2 underline-offset-4 transition hover:text-custom-orange"
        >
          Forgot password?
        </Link>
      </div>
      {error ? <FormNotice>{error}</FormNotice> : null}
      <AuthSubmitButton disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </AuthSubmitButton>
    </form>
  );
}
