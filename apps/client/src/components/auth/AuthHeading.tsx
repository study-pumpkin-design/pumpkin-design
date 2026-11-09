type AuthHeadingProps = {
  title: string;
  description: string;
  compact?: boolean;
};

export default function AuthHeading({
  title,
  description,
  compact = false,
}: AuthHeadingProps) {
  return (
    <div className={compact ? "mb-8" : "mb-9"}>
      <h1 className="text-[3rem] text-nowrap font-semibold leading-tight tracking-[-0.045em] text-[#201c29]">
        {title}
      </h1>
      <p className="mt-2 text-[20px] leading-6 text-[#706b78]">{description}</p>
    </div>
  );
}
