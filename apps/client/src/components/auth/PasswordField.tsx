"use client";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  hint?: string;
  required?: boolean;
};

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  hint,
  required = true,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-[#302a37]">
          {label}
          {required ? <span className="ml-1 text-custom-orange">*</span> : null}
        </label>
        {hint ? <span className="text-xs text-[#706b78]">{hint}</span> : null}
      </div>
      <div className="relative">
        <input
          id={id}
          name={id}
          required={required}
          minLength={8}
          autoComplete={autoComplete}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-xl border border-[#d8d3cb] bg-white px-3.5 pr-12 text-[15px] text-[#201c29] shadow-[0_1px_2px_rgba(32,28,41,0.04)] transition placeholder:text-[#9a95a0] hover:border-[#afa8b3] focus:border-custom-purple focus:outline-none focus:ring-4 focus:ring-custom-purple/20"
          placeholder="Enter your password"
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[#706b78] transition hover:bg-[#f2eff3] hover:text-[#201c29]"
        >
          {visible ? (
            <EyeOffIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}
