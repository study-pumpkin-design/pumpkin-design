import type { ReactNode } from "react";
export default function FormNotice({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success";
}) {
  const styles =
    tone === "error"
      ? "border-[#f0bbb4] bg-[#fff1ee] text-[#9e281a]"
      : "border-[#bbdfc3] bg-[#effaf1] text-[#176b34]";
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`rounded-xl border px-3.5 py-3 text-sm leading-5 ${styles}`}
    >
      {children}
    </p>
  );
}
