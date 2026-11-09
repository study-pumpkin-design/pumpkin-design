type AuthSubmitButtonProps = { children: string; disabled: boolean };
export default function AuthSubmitButton({
  children,
  disabled,
}: AuthSubmitButtonProps) {
  return (
    <button
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center rounded-xl bg-custom-orange px-5 text-[15px] font-semibold text-white shadow-[0_5px_0_#d92916] transition hover:-translate-y-0.5 hover:bg-[#ec301c] active:translate-y-0 active:shadow-[0_2px_0_#d92916] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
    >
      {children}
    </button>
  );
}
