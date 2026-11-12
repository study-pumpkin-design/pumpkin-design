"use client";

import { useAdmin } from "@/store/userStore";

function Dashboard() {
  const admin = useAdmin((state) => state.admin);
  const name = admin?.name || admin?.username;

  return (
    <section className="mx-auto w-full max-w-6xl">
      <p className="text-sm font-semibold text-custom-purple">
        Admin workspace
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {name ? `Welcome back, ${name}` : "Admin dashboard"}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-foreground/65">
        Use the navigation to manage your Pumpkin Design workspace.
      </p>
    </section>
  );
}

export default Dashboard;
