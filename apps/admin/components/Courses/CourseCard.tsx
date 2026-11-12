import Link from "next/link";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import type { Course } from "./types";

function formatDate(date: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function CourseCard({ course }: { course: Course }) {
  const isPublished = course.publish_status === "PUBLISHED";
  const topics = course.course_topics.slice(0, 2);
  const remainingTopics = course.course_topics.length - topics.length;

  return (
    <Link
      href={`/admin-dashboard/courses/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-[0_12px_30px_-24px_rgba(22,21,18,0.55)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-custom-purple/50 hover:shadow-[0_20px_38px_-24px_rgba(204,114,247,0.68)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-custom-purple motion-reduce:transform-none motion-reduce:transition-none"
      aria-label={`Open ${course.name}`}
    >
      <div className="relative grid aspect-[16/8] place-items-center overflow-hidden bg-gradient-to-br from-custom-purple/20 via-custom-purple/8 to-custom-highlight/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(251,214,35,0.3),transparent_20%),radial-gradient(circle_at_18%_76%,rgba(204,114,247,0.35),transparent_28%)]" />
        <div className="relative grid size-14 place-items-center rounded-2xl border border-foreground/10 bg-background/75 text-custom-purple shadow-sm backdrop-blur-sm">
          <BookOpen className="size-6" aria-hidden="true" />
        </div>
        <span className="absolute bottom-3 left-3 rounded-full border border-foreground/10 bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
          Course image coming soon
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isPublished ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-custom-highlight/25 text-foreground/75"}`}
          >
            <span
              className={`size-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-custom-orange"}`}
              aria-hidden="true"
            />
            {isPublished ? "Published" : "Unpublished"}
          </span>
          <span className="shrink-0 text-xs text-foreground/50">
            {formatDate(course.updatedAt)}
          </span>
        </div>
        <h2 className="mt-4 line-clamp-2 text-lg font-bold tracking-tight text-foreground">
          {course.name}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/65">
          {course.description || "No course description yet."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Course topics">
          {topics.length > 0 ? (
            <>
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="max-w-full truncate rounded-md bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground/70"
                >
                  {topic}
                </span>
              ))}
              {remainingTopics > 0 && (
                <span className="rounded-md bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground/60">
                  +{remainingTopics}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-foreground/50">No topics added</span>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4 text-sm font-semibold">
          <span className="inline-flex items-center gap-2 text-foreground/65">
            <Layers3 className="size-4 text-custom-purple" aria-hidden="true" />
            {course.learning_outcomes.length} learning outcome
            {course.learning_outcomes.length === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1 text-custom-purple transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
            View <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
