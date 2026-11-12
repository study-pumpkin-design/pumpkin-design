"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { BookOpenText, ChevronDown, CircleAlert, FileText, Film, Image as ImageIcon, Plus } from "lucide-react";
import axiosInstance from "@/app/lib/axiosInstance";
import type { courseTypes } from "@sd/types";

type Module = courseTypes.Module & {
  moduleContents?: courseTypes.ModuleContent[];
};

export function CourseModules({
  courseId,
  modules,
  onChanged,
}: {
  courseId: string;
  modules: Module[];
  onChanged: () => void;
}) {
  const [moduleName, setModuleName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function addModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!moduleName.trim()) return;
    setIsSaving(true);
    setError("");
    try {
      await axiosInstance.post(`/course/${courseId}/modules`, {
        name: moduleName.trim(),
      });
      setModuleName("");
      onChanged();
    } catch {
      setError("We couldn’t add this module. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-5 sm:p-6"
      aria-labelledby="course-modules-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="course-modules-heading"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <BookOpenText
              className="size-5 text-custom-purple"
              aria-hidden="true"
            />
            Course modules
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            Build the course sequence, then add lessons within each module.
          </p>
        </div>
        <span className="w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/65">
          {modules.length} module{modules.length === 1 ? "" : "s"}
        </span>
      </div>
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={addModule}
      >
        <label className="sr-only" htmlFor="module-name">
          Module name
        </label>
        <input
          id="module-name"
          value={moduleName}
          onChange={(event) => setModuleName(event.target.value)}
          placeholder="e.g. Getting started"
          className="min-h-11 flex-1 rounded-xl border border-foreground/15 bg-background px-4 text-sm outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
        />
        <button
          type="submit"
          disabled={isSaving || !moduleName.trim()}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-custom-purple px-5 text-sm font-bold text-[#24172b] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
        >
          <Plus className="size-4" aria-hidden="true" />
          {isSaving ? "Adding…" : "Add module"}
        </button>
      </form>
      {error && (
        <p
          className="mt-3 flex items-center gap-2 text-sm text-custom-orange"
          role="alert"
        >
          <CircleAlert className="size-4" aria-hidden="true" />
          {error}
        </p>
      )}
      <div className="mt-5 space-y-3">
        {modules.length ? (
          modules.map((module, index) => (
            <ModuleItem
              key={module.id}
              module={module}
              number={index + 1}
              onChanged={onChanged}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/15 bg-background/50 px-4 py-7 text-center text-sm text-foreground/60">
            No modules yet. Add the first module to begin structuring this
            course.
          </div>
        )}
      </div>
    </section>
  );
}

function ModuleItem({
  module,
  number,
  onChanged,
}: {
  module: Module;
  number: number;
  onChanged: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);
  async function addLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) {
      setError("Enter a lesson title.");
      return;
    }
    setIsAdding(true);
    setError("");
    try {
      const attachment = form.get("attachment");
      const video = form.get("video");
      const thumbnail = form.get("thumbnail");
      const [attachedAsset, videoAsset, thumbnailAsset] = await Promise.all([
        attachment instanceof File && attachment.size ? uploadAsset(attachment, "attachment") : Promise.resolve(null),
        video instanceof File && video.size ? uploadAsset(video, "video") : Promise.resolve(null),
        thumbnail instanceof File && thumbnail.size ? uploadAsset(thumbnail, "thumbnail") : Promise.resolve(null),
      ]);
      await axiosInstance.post(`/course/modules/${module.id}/contents`, {
        title,
        description: String(form.get("description") ?? "").trim(),
        text_content: String(form.get("text_content") ?? "").trim(),
        content_visibility: form.get("content_visibility"),
        attached_media: attachedAsset?.id ?? null,
        video_content: videoAsset?.id ?? null,
        video_thumbnail: thumbnailAsset?.id ?? null,
      });
      (event.target as HTMLFormElement).reset();
      setFormKey((current) => current + 1);
      onChanged();
    } catch {
      setError("We couldn’t add this lesson. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }
  return (
    <details
      className="group rounded-xl border border-foreground/10 bg-background"
      open={isOpen}
      onToggle={(event) => setIsOpen((event.target as HTMLDetailsElement).open)}
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 text-sm font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-custom-purple">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-custom-purple/15 text-xs text-foreground/75">
          {number}
        </span>
        <span className="min-w-0 flex-1 truncate">{module.name}</span>
        <span className="text-xs font-medium text-foreground/55">
          {module.moduleContents?.length ?? 0} lesson
          {module.moduleContents?.length === 1 ? "" : "s"}
        </span>
        <ChevronDown
          className="size-4 text-foreground/55 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-foreground/10 px-4 py-4">
        <div className="space-y-2">
          {module.moduleContents?.length ? (
            module.moduleContents.map((content) => (
              <article
                key={content.id}
                className="rounded-lg bg-foreground/[0.035] px-3 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{content.title}</h3>
                    {content.description && (
                      <p className="mt-1 text-sm text-foreground/65">
                        {content.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-foreground/5 px-2 py-1 text-[11px] font-semibold text-foreground/65">
                    {content.content_visibility === "ENROLLED"
                      ? "Enrolled"
                      : "Preview"}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <p className="py-2 text-sm text-foreground/60">No lessons yet.</p>
          )}
        </div>
        <form
          className="mt-4 grid gap-3 rounded-lg border border-dashed border-foreground/15 p-3"
          onSubmit={addLesson}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold text-foreground/70">
              Lesson title <span className="font-normal">Required</span>
              <input
                name="title"
                required
                className="min-h-10 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-foreground/70">
              Access
              <select
                name="content_visibility"
                defaultValue="PREVIEW"
                className="min-h-10 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
              >
                <option value="PREVIEW">Preview</option>
                <option value="ENROLLED">Enrolled learners</option>
              </select>
            </label>
          </div>
          <label className="grid gap-1.5 text-xs font-semibold text-foreground/70">
            Short description{" "}
            <input
              name="description"
              className="min-h-10 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
          <fieldset className="grid gap-3 rounded-lg bg-foreground/[0.025] p-3">
            <legend className="px-1 text-xs font-semibold text-foreground/70">Lesson assets <span className="font-normal">Optional</span></legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <UploadField key={`attachment-${formKey}`} name="attachment" label="Attachment" hint="Documents or supporting files" accept="*/*" icon={<FileText className="size-4" aria-hidden="true" />} />
              <UploadField key={`video-${formKey}`} name="video" label="Video" hint="Video files" accept="video/*" icon={<Film className="size-4" aria-hidden="true" />} />
              <UploadField key={`thumbnail-${formKey}`} name="thumbnail" label="Thumbnail" hint="Image shown for the video" accept="image/*" icon={<ImageIcon className="size-4" aria-hidden="true" />} />
            </div>
          </fieldset>
          <label className="grid gap-1.5 text-xs font-semibold text-foreground/70">
            Lesson text{" "}
            <textarea
              name="text_content"
              rows={3}
              className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
          {error && (
            <p
              className="flex items-center gap-2 text-sm text-custom-orange"
              role="alert"
            >
              <CircleAlert className="size-4" aria-hidden="true" />
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-foreground/15 px-4 text-sm font-bold hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
            >
              <Plus className="size-4" aria-hidden="true" />
              {isAdding ? "Uploading and adding…" : "Add lesson"}
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}

async function uploadAsset(file: File, kind: "attachment" | "video" | "thumbnail") {
  const data = new FormData();
  data.append("file", file);
  data.append("kind", kind);
  const response = await axiosInstance.post<{ data: { id: string } }>("/media/upload", data);
  return response.data.data;
}

function UploadField({ name, label, hint, accept, icon }: { name: string; label: string; hint: string; accept: string; icon: ReactNode }) {
  const [fileName, setFileName] = useState("");
  return <label className="grid min-h-24 cursor-pointer content-center gap-1 rounded-lg border border-dashed border-foreground/20 bg-background px-3 py-2 text-xs font-semibold text-foreground/75 transition-colors hover:border-custom-purple/60 focus-within:border-custom-purple focus-within:ring-2 focus-within:ring-custom-purple/25"><span className="flex items-center gap-1.5">{icon}{label}</span><span className="truncate text-[11px] font-normal text-foreground/55">{fileName || hint}</span><input name={name} type="file" accept={accept} className="sr-only" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /></label>;
}
