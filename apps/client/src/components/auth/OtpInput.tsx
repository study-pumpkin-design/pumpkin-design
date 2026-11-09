"use client";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function OtpInput({
  value,
  onChange,
  disabled = false,
}: OtpInputProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="sr-only">Six digit verification code</legend>
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Six digit verification code"
        maxLength={6}
        pattern="[0-9]{6}"
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        className="h-14 w-full rounded-xl border border-[#d8d3cb] bg-white px-4 text-center text-xl font-semibold tracking-[0.35em] tabular-nums text-[#201c29] shadow-[0_1px_2px_rgba(32,28,41,0.04)] transition hover:border-[#afa8b3] focus:border-custom-purple focus:outline-none focus:ring-4 focus:ring-custom-purple/20 disabled:cursor-not-allowed disabled:bg-[#f4f2ef]"
      />
    </fieldset>
  );
}
