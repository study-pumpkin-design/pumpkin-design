"use client";

import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { CourseCard } from "./CourseCard";
import { CourseCardSkeleton } from "./CourseCardSkeleton";
import { CoursesEmpty, CoursesError } from "./CoursesStates";
import { CoursesToolbar } from "./CoursesToolbar";
import { CourseCreateForm } from "./CourseCreateForm";
import type { Course, CourseResponse, StatusFilter } from "./types";

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response =
        await axiosInstance.get<CourseResponse>("/course/admin/all");
      setCourses(Array.isArray(response.data.data) ? response.data.data : []);
    } catch {
      setError(
        "We couldn’t load courses. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const requestId = window.setTimeout(() => void fetchCourses(), 0);
    return () => window.clearTimeout(requestId);
  }, []);

  const filteredCourses = useMemo(() => {
    const query = appliedSearch.trim().toLocaleLowerCase();

    return courses.filter((course) => {
      const matchesStatus =
        statusFilter === "ALL" || course.publish_status === statusFilter;
      const searchableContent = [
        course.name,
        course.description,
        ...course.course_topics,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return matchesStatus && (!query || searchableContent.includes(query));
    });
  }, [appliedSearch, courses, statusFilter]);

  const clearFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setStatusFilter("ALL");
  };

  return (
    <section className="mx-auto w-full max-w-7xl pb-8">
      <header className="flex flex-col gap-6 border-b border-foreground/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65 sm:text-base">
            Search, review, and manage every course in your workspace.
          </p>
        </div>
        {!isLoading && !error && (
          <p className="shrink-0 text-sm text-foreground/60" aria-live="polite">
            {filteredCourses.length} of {courses.length} course
            {courses.length === 1 ? "" : "s"}
          </p>
        )}
      </header>

      <CoursesToolbar
        isLoading={isLoading}
        searchInput={searchInput}
        statusFilter={statusFilter}
        onSearchInputChange={setSearchInput}
        onStatusFilterChange={setStatusFilter}
        onSubmit={() => setAppliedSearch(searchInput)}
        onCreateCourse={() => setIsCreateOpen(true)}
      />
      {isCreateOpen && (
        <CourseCreateForm
          onCancel={() => setIsCreateOpen(false)}
          onCreated={() => {
            setIsCreateOpen(false);
            void fetchCourses();
          }}
        />
      )}

      {error ? (
        <CoursesError message={error} onRetry={() => void fetchCourses()} />
      ) : isLoading ? (
        <div
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Loading courses"
          aria-busy="true"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <CoursesEmpty onClear={clearFilters} />
      )}
    </section>
  );
}

export default Courses;
