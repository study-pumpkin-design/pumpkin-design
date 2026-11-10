"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useAdmin } from "@/store/userStore";

function AdminProfile({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const { admin, setData, logout } = useAdmin();
  const [isLoading, setIsLoading] = useState(!admin);

  useEffect(() => {
    let active = true;

    async function refreshAdmin() {
      try {
        const response = await axiosInstance.get("/admin/me");
        if (active && response.data?.data) setData(response.data.data);
      } catch {
        // Cached profile data remains visible if the refresh cannot complete.
      } finally {
        if (active) setIsLoading(false);
      }
    }

    refreshAdmin();
    return () => {
      active = false;
    };
  }, [setData]);

  if (isLoading && !admin) {
    return (
      <div
        aria-label="Loading administrator profile"
        className="mx-3 h-14 animate-pulse rounded-xl bg-foreground/10"
      />
    );
  }

  const displayName = admin?.name || admin?.username || "Administrator";
  const role = admin?.moderator_type
    ? `${admin.moderator_type} administrator`
    : "Administrator";
  const profileHref = admin?.username
    ? `/admin/${admin.username}`
    : "/admin-dashboard";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    logout();
    router.replace("/login");
  };

  return (
    <section
      aria-label="Administrator profile"
      className="border-t border-foreground/10 p-3"
    >
      <Link
        href={profileHref}
        title={collapsed ? `${displayName} — ${role}` : undefined}
        className={`flex min-h-12 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple ${collapsed ? "justify-center" : ""}`}
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-custom-purple font-semibold text-white"
          aria-hidden="true"
        >
          {admin ? initial : <UserRound className="size-4" />}
        </span>
        {!collapsed && (
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {displayName}
            </span>
            <span className="block truncate text-xs text-foreground/55">
              {role}
            </span>
            {admin?.username && (
              <span className="block truncate text-xs text-custom-purple">
                /admin/{admin.username}
              </span>
            )}
          </span>
        )}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        title={collapsed ? "Log out" : undefined}
        className={`mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-sm font-medium text-custom-orange transition-colors hover:bg-custom-orange/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-orange ${collapsed ? "justify-center" : ""}`}
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        {!collapsed && <span>Log out</span>}
      </button>
    </section>
  );
}

export default AdminProfile;
