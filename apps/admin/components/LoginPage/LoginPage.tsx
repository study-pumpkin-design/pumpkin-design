import axios from "axios";
import Image from "next/image";
import logo from "@/public/vercel.svg";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState, type FormEventHandler } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const passwordStrength = useMemo(() => {
    if (!password) return { label: "", score: 0 };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return {
      label:
        score <= 1
          ? "Weak"
          : score <= 2
            ? "Fair"
            : score === 3
              ? "Good"
              : "Strong",
      score,
    };
  }, [password]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/auth/admin-login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      setSuccess("You have signed in successfully.");
      router.push("/admin-dashboard");
    } catch (submitError) {
      const data = axios.isAxiosError(submitError)
        ? submitError.response?.data
        : undefined;
      setError(
        data?.message ||
          data?.error ||
          (submitError instanceof Error
            ? submitError.message
            : "Something went wrong. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-12 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-custom-purple shadow-lg shadow-custom-purple/25"
            aria-label="Pumpkin logo"
          >
            <Image
              src={logo}
              alt="website-logo"
              height={200}
              width={200}
              className="h-10 w-10 text-white"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Pumpkin Design
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Log in to access the dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-custom-purple focus:ring-4 focus:ring-custom-purple/15"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                {password && (
                  <span className="text-xs font-medium text-slate-500">
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-custom-purple focus:ring-4 focus:ring-custom-purple/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-custom-purple"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {password && (
                <div
                  className="mt-3 flex gap-1"
                  aria-label={`Password strength: ${passwordStrength.label}`}
                >
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={`h-1.5 flex-1 rounded-full ${level <= passwordStrength.score ? (passwordStrength.score <= 1 ? "bg-custom-orange" : passwordStrength.score <= 2 ? "bg-custom-highlight" : "bg-custom-purple") : "bg-slate-200"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-custom-orange px-4 py-3 text-sm font-bold text-white transition hover:bg-custom-orange/90 focus:outline-none focus:ring-4 focus:ring-custom-orange/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <button
            type="button"
            onClick={() =>
              setError(
                "Password reset is not available yet. Please contact your administrator.",
              )
            }
            className="mt-5 block w-full text-center text-sm font-semibold text-custom-purple hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
