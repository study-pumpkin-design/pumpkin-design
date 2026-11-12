"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  LayoutDashboard,
  Presentation,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import logo from "@/public/logo.png";
import AdminProfile from "./AdminProfile";
import ThemePicker from "./ThemePicker";

const sidebarLimits = { min: 232, max: 384, default: 280 };

const navigation = [
  { href: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin-dashboard/courses",
    label: "Courses",
    icon: Presentation,
  },
];

function DashboardSidebar() {
  const [width, setWidth] = useState(sidebarLimits.default);
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const dragWidth = useRef(width);
  const animationFrame = useRef<number | null>(null);

  const clampWidth = (value: number) =>
    Math.min(sidebarLimits.max, Math.max(sidebarLimits.min, value));

  const setDragWidth = (value: number) => {
    dragWidth.current = clampWidth(value);
    if (animationFrame.current) return;

    animationFrame.current = requestAnimationFrame(() => {
      sidebarRef.current?.style.setProperty("width", `${dragWidth.current}px`);
      animationFrame.current = null;
    });
  };

  const finishResize = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
      sidebarRef.current?.style.setProperty("width", `${dragWidth.current}px`);
    }
    setWidth(dragWidth.current);
    setIsResizing(false);
  };

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 32 : 16;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setWidth((current) => clampWidth(current - step));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setWidth((current) => clampWidth(current + step));
    }
  };

  const handleResizeStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragWidth.current = width;
    setIsResizing(true);
  };

  const handleResizeMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isResizing) return;
    setDragWidth(event.clientX);
  };

  return (
    <aside
      ref={sidebarRef}
      style={{ width: collapsed ? 76 : width }}
      className={`relative flex h-full shrink-0 flex-col border-r border-foreground/10 bg-background ${isResizing ? "" : "transition-[width] duration-200 motion-reduce:transition-none"}`}
    >
      <div
        className={`flex h-20 mt-4 items-center border-b border-foreground/10 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}
      >
        <Link
          href="/admin-dashboard"
          className="flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          aria-label="Pumpkin Design dashboard"
        >
          <Image
            src={logo}
            width={50}
            height={50}
            alt=""
            className="size-20 mt-2 object-contain"
          />
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight">
              Pumpkin Design
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="grid size-10 place-items-center rounded-lg text-foreground/60 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
      >
        {!collapsed && (
          <p className="mb-2 px-2 text-xs font-semibold text-foreground/55">
            Workspace
          </p>
        )}
        <ul className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                title={collapsed ? label : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-foreground transition-colors hover:bg-custom-purple/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple ${collapsed ? "justify-center px-2" : ""} bg-custom-purple/15`}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {!collapsed && label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <ThemePicker collapsed={collapsed} />
        <AdminProfile collapsed={collapsed} />
      </div>

      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="absolute -right-4 top-8 z-10 grid size-8 place-items-center rounded-full border border-foreground/15 bg-background text-foreground shadow-sm hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={finishResize}
          onPointerCancel={finishResize}
          onKeyDown={handleResizeKeyDown}
          aria-label="Resize sidebar. Use left and right arrow keys to adjust the width."
          aria-valuemin={sidebarLimits.min}
          aria-valuemax={sidebarLimits.max}
          aria-valuenow={width}
          role="separator"
          className="absolute -right-3 top-1/2 z-10 grid size-8 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full border border-foreground/15 bg-background text-foreground/55 shadow-sm transition-colors hover:bg-custom-purple hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
      )}
    </aside>
  );
}

export default DashboardSidebar;
