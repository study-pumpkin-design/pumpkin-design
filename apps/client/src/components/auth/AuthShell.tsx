import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup" | "reset";
};
const copy = {
  login: {
    title: "Return to your next design decision.",
    body: "Practice turning a product constraint into a system that can scale, recover, and stay understandable.",
  },
  signup: {
    title: "Practice systems, not just diagrams.",
    body: "Work through real architecture choices step by step, then explain the trade-offs behind each one.",
  },
  reset: {
    title: "Your next scenario is still waiting.",
    body: "Reset your password, then continue learning how dependable systems are shaped under constraints.",
  },
} as const;

export default function AuthShell({ children, mode }: AuthShellProps) {
  const panelCopy = copy[mode];
  return (
    <main className="min-h-screen w-full bg-custom-bg text-[#201c29]">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] overflow-hidden  bg-[#fffefd] shadow-[0_22px_80px_rgba(48,36,32,0.12)] lg:grid-cols-[minmax(460px,0.93fr)_minmax(480px,1.07fr)] ">
        <section className="flex min-h-full flex-col px-6 py-7 sm:px-10 sm:py-10 lg:px-[clamp(3rem,6vw,7.5rem)] lg:py-12">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-lg font-semibold tracking-[-0.03em]"
              aria-label="Pumpkin Design home"
            >
              <Image
                src="/public/logo.png"
                alt="Pumpkin Design logo"
                width={36}
                height={36}
                className="size-9 object-contain transition-transform duration-200 group-hover:-translate-y-0.5"
              />
              <span className="text-[15px]">Pumpkin Design</span>
            </Link>
            <p className="text-right text-sm leading-5 text-[#706b78]">
              {mode === "login"
                ? "New here?"
                : mode === "signup"
                  ? "Already have an account?"
                  : "Remembered it?"}{" "}
              <Link
                className="font-semibold text-[#201c29] underline decoration-custom-orange decoration-2 underline-offset-4 hover:text-custom-orange"
                href={mode === "login" ? "/sign-up" : "/login"}
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </Link>
            </p>
          </header>
          <div className="mx-auto flex w-full max-w-102.5 flex-1 flex-col justify-center py-12 lg:py-16">
            {children}
          </div>
        </section>
        <aside className="relative hidden overflow-hidden bg-[#2a2137] p-8 text-white lg:flex lg:min-h-180 lg:flex-col xl:p-11">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_16%,rgba(204,114,247,0.86),transparent_28%),radial-gradient(circle_at_7%_95%,rgba(255,57,34,0.85),transparent_33%)]" />
          <div className="relative z-10 flex items-center justify-between text-sm font-medium text-white/80">
            <span>System Design Lab</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              Learn by building
            </span>
          </div>
          <div className="relative z-10 my-auto max-w-lg py-14">
            <p className="mb-5 max-w-[15ch] text-5xl font-semibold leading-[0.97] tracking-[-0.055em] xl:text-6xl">
              {panelCopy.title}
            </p>
            <p className="max-w-md text-base leading-7 text-white/75">
              {panelCopy.body}
            </p>
          </div>
          <div className="relative z-10 grid h-72.5 grid-cols-[1.08fr_0.92fr] gap-4 xl:h-82.5">
            <div className="relative overflow-hidden rounded-2xl bg-[#fbd623] p-5 text-[#201c29] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
              <p className="text-sm font-semibold">Start with the flow</p>
              <div
                aria-label="Example system flow: client, gateway, service, and database"
                className="relative mt-7 grid gap-3"
              >
                <div className="flex items-center justify-between rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm">
                  <span>Client</span>
                  <span className="text-custom-orange">Request</span>
                </div>
                <div className="ml-7 flex items-center justify-between rounded-lg bg-[#2a2137] px-3 py-2 text-xs font-semibold text-white shadow-sm">
                  <span>API Gateway</span>
                  <span className="text-custom-highlight">Route</span>
                </div>
                <div className="ml-3 flex items-center justify-between rounded-lg bg-custom-purple px-3 py-2 text-xs font-semibold text-[#201c29] shadow-sm">
                  <span>Service</span>
                  <span>Process</span>
                </div>
                <div className="ml-10 flex items-center justify-between rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm">
                  <span>Database</span>
                  <span className="text-custom-orange">Store</span>
                </div>
              </div>
              <p className="absolute bottom-5 text-xs leading-5 text-[#4a3d29]">
                Follow a request, then question every handoff.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="min-h-0 flex-1 rounded-2xl bg-custom-purple p-5 text-[#201c29] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    Every choice has a cost.
                  </p>
                  <Image
                    src="/public/logo.png"
                    alt="Pumpkin Design logo"
                    width={32}
                    height={32}
                    className="size-8 object-contain"
                  />
                </div>
                <div className="mt-5 space-y-2 text-xs font-semibold">
                  <span className="block rounded-lg bg-white/45 px-3 py-2">
                    Latency
                  </span>
                  <span className="block rounded-lg bg-white/45 px-3 py-2">
                    Reliability
                  </span>
                  <span className="block rounded-lg bg-white/45 px-3 py-2">
                    Cost
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-[#fffefd] p-4 text-[#201c29] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                <p className="text-xs font-semibold text-[#706b78]">
                  How practice works
                </p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.04em]">
                  Frame the problem. Defend the trade-off.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
