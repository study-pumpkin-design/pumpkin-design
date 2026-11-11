export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background" aria-hidden="true">
      <div className="aspect-[16/8] animate-pulse bg-foreground/8 motion-reduce:animate-none" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-24 animate-pulse rounded bg-foreground/8 motion-reduce:animate-none" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-foreground/8 motion-reduce:animate-none" />
        <div className="h-12 animate-pulse rounded bg-foreground/8 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
