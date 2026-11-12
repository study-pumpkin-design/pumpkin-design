"use client";
import type { ReactNode } from "react";
import DashboardSidebar from "@/components/general/DashboardSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <DashboardSidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-10 sm:px-10 lg:px-14">
        {children}
      </main>
    </div>
  );
}
