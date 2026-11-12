"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Plus, X } from "lucide-react";
import axiosInstance from "@/app/lib/axiosInstance";

type CourseCreateFormProps = { onCreated: () => void; onCancel: () => void };

const splitItems = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export function CourseCreateForm({
  onCreated,
  onCancel,
}: CourseCreateFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const course_topics = splitItems(String(form.get("topics") ?? ""));
    const learning_outcomes = splitItems(String(form.get("outcomes") ?? ""));
    if (!name || !description) {
      setError("Enter a course name and description before saving.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await axiosInstance.post("/course/create-course", {
        name,
        description,
        course_topics,
        learning_outcomes,
        publish_status: form.get("publish_status"),
      });
      onCreated();
    } catch {
      setError(
        "We couldn’t create this course. Please check the details and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-custom-purple/30 bg-custom-purple/[0.06] p-5 sm:p-6"
      aria-labelledby="new-course-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="new-course-heading"
            className="text-lg font-bold text-foreground"
          >
            Create a course
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            Add the essentials now; modules and lessons are added from the
            course page.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid size-11 shrink-0 place-items-center rounded-lg text-foreground/65 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          aria-label="Close course form"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <form className="mt-6 grid gap-5" onSubmit={submit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Course name{" "}
            <span className="font-normal text-foreground/60">Required</span>
            <input
              name="name"
              required
              className="min-h-12 rounded-xl border border-foreground/15 bg-background px-4 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Publishing status
            <select
              name="publish_status"
              defaultValue="UN_PUBLISHED"
              className="min-h-12 rounded-xl border border-foreground/15 bg-background px-4 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            >
              <option value="UN_PUBLISHED">Unpublished</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Description{" "}
          <span className="font-normal text-foreground/60">Required</span>
          <textarea
            name="description"
            required
            rows={3}
            className="rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
          />
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Topics{" "}
            <span className="font-normal text-foreground/60">One per line</span>
            <textarea
              name="topics"
              rows={4}
              className="rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Learning outcomes{" "}
            <span className="font-normal text-foreground/60">One per line</span>
            <textarea
              name="outcomes"
              rows={4}
              className="rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
        </div>
        {error && (
          <p
            className="flex items-center gap-2 text-sm text-custom-orange"
            role="alert"
          >
            <CircleAlert className="size-4" aria-hidden="true" />
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-xl px-4 text-sm font-bold text-foreground/70 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-custom-purple px-5 text-sm font-bold text-[#24172b] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          >
            <Plus className="size-4" aria-hidden="true" />
            {isSaving ? "Creating…" : "Create course"}
          </button>
        </div>
      </form>
    </section>
  );
}
