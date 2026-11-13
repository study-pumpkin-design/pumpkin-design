"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, CircleAlert, Pencil, X } from "lucide-react";
import axiosInstance from "@/app/lib/axiosInstance";

type EditableCourse = {
  id: string;
  name: string;
  description: string;
  course_topics: string[];
  learning_outcomes: string[];
  publish_status: "PUBLISHED" | "UN_PUBLISHED";
};

const splitItems = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export function CourseDetailsEditor({
  course,
  onSaved,
}: {
  course: EditableCourse;
  onSaved: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [publishStatus, setPublishStatus] = useState(course.publish_status);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    if (!name || !description) {
      setError("Enter a course name and description before saving.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await axiosInstance.post(`/course/update-course/${course.id}`, {
        name,
        description,
        course_topics: splitItems(String(form.get("topics") ?? "")),
        learning_outcomes: splitItems(String(form.get("outcomes") ?? "")),
        publish_status: form.get("publish_status"),
      });
      setPublishStatus(
        String(form.get("publish_status")) as EditableCourse["publish_status"],
      );
      setIsOpen(false);
      onSaved();
    } catch {
      setError("We couldn’t save these course details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-foreground/15 bg-background px-4 text-sm font-bold hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit course details
        </button>
      </div>
    );
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-custom-purple/30 bg-custom-purple/[0.06] p-5 sm:p-6"
      aria-labelledby="course-details-editor-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="course-details-editor-heading" className="text-lg font-bold">
            Edit course details
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            Update what learners see, then save or publish when it is ready.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsOpen(false);
          }}
          className="grid size-11 place-items-center rounded-lg hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          aria-label="Close course editor"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <form className="mt-6 grid gap-5" onSubmit={save}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Course name" required>
            <input
              name="name"
              required
              defaultValue={course.name}
              className={inputClassName}
            />
          </Field>
          <Field label="Publishing status">
            <select
              name="publish_status"
              value={publishStatus}
              onChange={(event) =>
                setPublishStatus(
                  event.target.value as EditableCourse["publish_status"],
                )
              }
              className={inputClassName}
            >
              <option value="UN_PUBLISHED">Unpublished</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </Field>
        </div>
        <Field label="Description" required>
          <textarea
            name="description"
            required
            rows={3}
            defaultValue={course.description}
            className={textareaClassName}
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Topics" hint="One per line">
            <textarea
              name="topics"
              rows={5}
              defaultValue={course.course_topics.join("\n")}
              className={textareaClassName}
            />
          </Field>
          <Field label="Learning outcomes" hint="One per line">
            <textarea
              name="outcomes"
              rows={5}
              defaultValue={course.learning_outcomes.join("\n")}
              className={textareaClassName}
            />
          </Field>
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
            onClick={() => setIsOpen(false)}
            className="min-h-11 rounded-xl px-4 text-sm font-bold text-foreground/70 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-custom-purple px-5 text-sm font-bold text-[#24172b] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
          >
            <Check className="size-4" aria-hidden="true" />
            {isSaving
              ? "Saving…"
              : publishStatus === "PUBLISHED" &&
                  course.publish_status !== "PUBLISHED"
                ? "Save and publish"
                : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

const inputClassName =
  "min-h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25";
const textareaClassName =
  "w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}{" "}
      {required && (
        <span className="font-normal text-foreground/60">Required</span>
      )}
      {hint && <span className="font-normal text-foreground/60">{hint}</span>}
      {children}
    </label>
  );
}
