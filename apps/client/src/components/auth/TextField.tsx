type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "email" | "text";
  autoComplete: string;
};

export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-[#302a37]"
      >
        {label} <span className="text-custom-orange">*</span>
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-[#d8d3cb] bg-white px-3.5 text-[15px] text-[#201c29] shadow-[0_1px_2px_rgba(32,28,41,0.04)] transition placeholder:text-[#9a95a0] hover:border-[#afa8b3] focus:border-custom-purple focus:outline-none focus:ring-4 focus:ring-custom-purple/20"
      />
    </div>
  );
}
