"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authRequest } from "@/lib/auth";
import AuthShell from "../auth/AuthShell";
import FormNotice from "../auth/FormNotice";
import { ArrowLeftIcon } from "../auth/Icons";
import OtpInput from "../auth/OtpInput";
import PasswordField from "../auth/PasswordField";
type Stage = "email" | "otp" | "password" | "complete";

export default function ForgotPassword() {
  const params = useSearchParams();
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const cleanEmail = email.trim();
  const execute = async (action: () => Promise<void>) => {
    setError("");
    setLoading(true);
    try {
      await action();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t complete that request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  const requestCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void execute(async () => {
      await authRequest("/auth/initiate-reset-password", { email: cleanEmail });
      setStage("otp");
    });
  };
  const verifyCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the complete six-digit code from your email.");
      return;
    }
    void execute(async () => {
      await authRequest("/auth/verify-reset-password", {
        email: cleanEmail,
        otp,
      });
      setStage("password");
    });
  };
  const updatePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void execute(async () => {
      await authRequest("/auth/update-password", {
        email: cleanEmail,
        password,
      });
      setStage("complete");
    });
  };
  const heading =
    stage === "email"
      ? "Reset your password"
      : stage === "otp"
        ? "Check your inbox"
        : stage === "password"
          ? "Choose a new password"
          : "Password updated";
  const description =
    stage === "email" ? (
      "Enter your email and we’ll send a six-digit verification code."
    ) : stage === "otp" ? (
      <>
        We sent a code to{" "}
        <strong className="font-semibold text-[#302a37]">{cleanEmail}</strong>.
      </>
    ) : stage === "password" ? (
      "Make it long, memorable, and unique to Pumpkin Design."
    ) : (
      "Your password has been changed. You can now sign in with the new one."
    );
  return (
    <AuthShell mode="reset">
      {stage !== "complete" ? (
        <Link
          href="/login"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-[#5c3b70] transition hover:text-custom-orange"
        >
          <ArrowLeftIcon className="size-4" /> Back to sign in
        </Link>
      ) : null}
      <div className="mb-8">
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-[#201c29]">
          {heading}
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-[#706b78]">
          {description}
        </p>
      </div>
      {stage === "email" ? (
        <form onSubmit={requestCode} className="space-y-5">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-semibold text-[#302a37]"
            >
              Email <span className="text-custom-orange">*</span>
            </label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="h-12 w-full rounded-xl border border-[#d8d3cb] bg-white px-3.5 text-[15px] text-[#201c29] shadow-[0_1px_2px_rgba(32,28,41,0.04)] transition placeholder:text-[#9a95a0] hover:border-[#afa8b3] focus:border-custom-purple focus:outline-none focus:ring-4 focus:ring-custom-purple/20"
            />
          </div>
          {error ? <FormNotice>{error}</FormNotice> : null}
          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-custom-orange px-5 text-[15px] font-semibold text-white shadow-[0_5px_0_#d92916] transition hover:-translate-y-0.5 hover:bg-[#ec301c] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
          >
            {loading ? "Sending code…" : "Send verification code"}
          </button>
        </form>
      ) : null}
      {stage === "otp" ? (
        <form onSubmit={verifyCode} className="space-y-6">
          <OtpInput value={otp} onChange={setOtp} disabled={loading} />

          {error ? <FormNotice>{error}</FormNotice> : null}
          <button
            disabled={loading || otp.length !== 6}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-custom-orange px-5 text-[15px] font-semibold text-white shadow-[0_5px_0_#d92916] transition hover:-translate-y-0.5 hover:bg-[#ec301c] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {loading ? "Verifying code…" : "Verify code"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              void execute(async () => {
                await authRequest("/auth/initiate-reset-password", {
                  email: cleanEmail,
                });
                setOtp("");
              })
            }
            className="mx-auto block rounded-md text-sm font-semibold text-[#5c3b70] underline decoration-custom-purple decoration-2 underline-offset-4 hover:text-custom-orange disabled:opacity-60"
          >
            Send a new code
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setStage("email");
            }}
            className="mx-auto block rounded-md text-sm text-[#706b78] underline underline-offset-4 hover:text-[#201c29]"
          >
            Use a different email
          </button>
        </form>
      ) : null}
      {stage === "password" ? (
        <form onSubmit={updatePassword} className="space-y-5">
          <PasswordField
            id="new-password"
            label="New password"
            hint="8+ characters"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          {error ? <FormNotice>{error}</FormNotice> : null}
          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-custom-orange px-5 text-[15px] font-semibold text-white shadow-[0_5px_0_#d92916] transition hover:-translate-y-0.5 hover:bg-[#ec301c] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
          >
            {loading ? "Updating password…" : "Update password"}
          </button>
        </form>
      ) : null}
      {stage === "complete" ? (
        <div className="space-y-5">
          <FormNotice tone="success">Password changed successfully.</FormNotice>
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-custom-orange px-5 text-[15px] font-semibold text-white shadow-[0_5px_0_#d92916] transition hover:-translate-y-0.5 hover:bg-[#ec301c]"
          >
            Continue to sign in
          </Link>
        </div>
      ) : null}
    </AuthShell>
  );
}
