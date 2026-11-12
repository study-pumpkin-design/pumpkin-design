import { CircleAlert, RefreshCw, Sparkles } from "lucide-react";

export function CoursesError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="mt-8 rounded-2xl border border-custom-orange/30 bg-custom-orange/10 p-6"
      role="alert"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <CircleAlert
            className="mt-0.5 size-5 shrink-0 text-custom-orange"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-bold text-foreground">
              Courses are unavailable
            </h2>
            <p className="mt-1 text-sm text-foreground/70">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-foreground/15 bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple sm:self-auto"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}

export function CoursesEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-8 grid min-h-80 place-items-center rounded-2xl border border-dashed border-foreground/20 bg-foreground/[0.025] p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-custom-purple/15 text-custom-purple">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-foreground">
          No courses match your search
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground/65">
          Try another keyword or choose a different status filter.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-5 min-h-11 rounded-lg px-4 text-sm font-semibold text-custom-purple transition-colors hover:bg-custom-purple/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
