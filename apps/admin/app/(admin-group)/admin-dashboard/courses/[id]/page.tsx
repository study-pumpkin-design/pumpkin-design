"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CircleAlert,
  Layers3,
  Target,
} from "lucide-react";
import axiosInstance from "@/app/lib/axiosInstance";
import type { courseTypes } from "@sd/types";
import { CourseModules } from "@/components/Courses/CourseModules";

type Course = Omit<courseTypes.Course, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");

  const fetchCourse = useCallback(async () => {
    setError("");
    try {
      const response = await axiosInstance.get<{ data: Course }>(
        `/course/admin/course/${id}`,
      );
      setCourse(response.data.data);
    } catch {
      setError(
        "We couldn’t load this course. Please return to courses and try again.",
      );
    }
  }, [id]);

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      void fetchCourse();
    }, 0);

    return () => window.clearTimeout(requestId);
  }, [fetchCourse]);

  return (
    <section className="mx-auto w-full max-w-5xl pb-8">
      <Link
        href="/admin-dashboard/courses"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-foreground/65 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to courses
      </Link>

      {error ? (
        <div
          className="mt-8 rounded-2xl border border-custom-orange/30 bg-custom-orange/10 p-6"
          role="alert"
        >
          <div className="flex gap-3">
            <CircleAlert
              className="mt-0.5 size-5 shrink-0 text-custom-orange"
              aria-hidden="true"
            />
            <div>
              <h1 className="font-bold text-foreground">Course unavailable</h1>
              <p className="mt-1 text-sm text-foreground/70">{error}</p>
            </div>
          </div>
        </div>
      ) : !course ? (
        <div
          className="mt-8 animate-pulse space-y-5 motion-reduce:animate-none"
          aria-label="Loading course"
          aria-busy="true"
        >
          <div className="h-10 w-2/3 rounded bg-foreground/8" />
          <div className="h-32 rounded-2xl bg-foreground/8" />
          <div className="h-48 rounded-2xl bg-foreground/8" />
        </div>
      ) : (
        <div className="mt-7">
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-custom-purple/20 via-background to-custom-highlight/15 p-7 sm:p-10">
            <div className="absolute right-6 bottom-6 hidden size-24 place-items-center rounded-2xl border border-foreground/10 bg-background/65 text-custom-purple sm:grid">
              <BookOpen className="size-10" aria-hidden="true" />
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${course.publish_status === "PUBLISHED" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-custom-highlight/25 text-foreground/75"}`}
            >
              <span
                className={`size-1.5 rounded-full ${course.publish_status === "PUBLISHED" ? "bg-emerald-500" : "bg-custom-orange"}`}
                aria-hidden="true"
              />
              {course.publish_status === "PUBLISHED"
                ? "Published"
                : "Unpublished"}
            </span>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              {course.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/70">
              {course.description || "No course description yet."}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Layers3
                  className="size-5 text-custom-purple"
                  aria-hidden="true"
                />
                Topics
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.course_topics.length ? (
                  course.course_topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg bg-foreground/5 px-3 py-2 text-sm text-foreground/70"
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60">No topics added.</p>
                )}
              </div>
            </article>
            <article className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Target
                  className="size-5 text-custom-purple"
                  aria-hidden="true"
                />
                Learning outcomes
              </h2>
              <ul className="mt-4 space-y-3">
                {course.learning_outcomes.length ? (
                  course.learning_outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex gap-3 text-sm leading-6 text-foreground/70"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-custom-purple"
                        aria-hidden="true"
                      />
                      {outcome}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-foreground/60">
                    No learning outcomes added.
                  </li>
                )}
              </ul>
            </article>
          </div>
          <CourseModules
            courseId={course.id}
            modules={course.modules ?? []}
            onChanged={() => void fetchCourse()}
          />
        </div>
      )}
    </section>
  );
}
