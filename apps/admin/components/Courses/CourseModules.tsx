"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  BookOpenText,
  ChevronDown,
  CircleAlert,
  FileText,
  Film,
  Image as ImageIcon,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
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
  const [selectedLesson, setSelectedLesson] =
    useState<courseTypes.ModuleContent | null>(null);

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
    <>
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
              Build the course sequence, then select any lesson to edit its
              details or media.
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
        {error && <Notice>{error}</Notice>}
        <div className="mt-5 space-y-3">
          {modules.length ? (
            modules.map((module, index) => (
              <ModuleItem
                key={module.id}
                module={module}
                number={index + 1}
                onChanged={onChanged}
                onSelectLesson={setSelectedLesson}
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
      {selectedLesson && (
        <LessonDrawer
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onChanged={() => {
            setSelectedLesson(null);
            onChanged();
          }}
        />
      )}
    </>
  );
}

function ModuleItem({
  module,
  number,
  onChanged,
  onSelectLesson,
}: {
  module: Module;
  number: number;
  onChanged: () => void;
  onSelectLesson: (lesson: courseTypes.ModuleContent) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const attachment = fileFrom(form, "attachment"),
        video = fileFrom(form, "video"),
        thumbnail = fileFrom(form, "thumbnail");
      const [attachedAsset, videoAsset, thumbnailAsset] = await Promise.all([
        attachment
          ? uploadAsset(attachment, "attachment")
          : Promise.resolve(null),
        video ? uploadAsset(video, "video") : Promise.resolve(null),
        thumbnail ? uploadAsset(thumbnail, "thumbnail") : Promise.resolve(null),
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
      event.currentTarget.reset();
      setFormKey((value) => value + 1);
      onChanged();
    } catch {
      setError("We couldn’t add this lesson. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }
  async function deleteModule() {
    if (
      !window.confirm(
        `Delete “${module.name}” and every lesson in it? This also permanently removes their uploaded media.`,
      )
    )
      return;
    setIsDeleting(true);
    setError("");
    try {
      await axiosInstance.delete(`/course/modules/${module.id}`);
      onChanged();
    } catch {
      setError("We couldn’t delete this module. Please try again.");
    } finally {
      setIsDeleting(false);
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
        <div className="flex justify-end">
          <button
            type="button"
            onClick={deleteModule}
            disabled={isDeleting}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-500/10 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-red-300"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {isDeleting ? "Deleting…" : "Delete module"}
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {module.moduleContents?.length ? (
            module.moduleContents.map((content) => (
              <button
                key={content.id}
                type="button"
                onClick={() => onSelectLesson(content)}
                className="w-full rounded-lg bg-foreground/[0.035] px-3 py-3 text-left transition-colors hover:bg-custom-purple/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Pencil
                        className="size-3.5 text-custom-purple"
                        aria-hidden="true"
                      />
                      {content.title}
                    </span>
                    {content.description && (
                      <span className="mt-1 block text-sm text-foreground/65">
                        {content.description}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 rounded-full bg-foreground/5 px-2 py-1 text-[11px] font-semibold text-foreground/65">
                    {content.content_visibility === "ENROLLED"
                      ? "Enrolled"
                      : "Preview"}
                  </span>
                </span>
              </button>
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
            <TextField name="title" label="Lesson title" required />
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
          <TextField name="description" label="Short description" />
          <AssetFields formKey={formKey} />
          <label className="grid gap-1.5 text-xs font-semibold text-foreground/70">
            Lesson text
            <textarea
              name="text_content"
              rows={3}
              className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
          {error && <Notice>{error}</Notice>}
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

function LessonDrawer({
  lesson,
  onClose,
  onChanged,
}: {
  lesson: courseTypes.ModuleContent;
  onClose: () => void;
  onChanged: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSaving(true);
    setError("");
    try {
      const attachment = fileFrom(form, "attachment"),
        video = fileFrom(form, "video"),
        thumbnail = fileFrom(form, "thumbnail");
      const [attachmentAsset, videoAsset, thumbnailAsset] = await Promise.all([
        attachment
          ? uploadAsset(attachment, "attachment")
          : Promise.resolve(undefined),
        video ? uploadAsset(video, "video") : Promise.resolve(undefined),
        thumbnail
          ? uploadAsset(thumbnail, "thumbnail")
          : Promise.resolve(undefined),
      ]);
      await axiosInstance.patch(`/course/contents/${lesson.id}`, {
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        text_content: String(form.get("text_content") ?? "").trim(),
        content_visibility: form.get("content_visibility"),
        ...(attachmentAsset && { attached_media: attachmentAsset.id }),
        ...(videoAsset && { video_content: videoAsset.id }),
        ...(thumbnailAsset && { video_thumbnail: thumbnailAsset.id }),
      });
      onChanged();
    } catch {
      setError("We couldn’t save this lesson. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }
  async function deleteLesson() {
    if (
      !window.confirm(
        `Delete “${lesson.title}”? Its uploaded media will be permanently removed.`,
      )
    )
      return;
    setIsDeleting(true);
    setError("");
    try {
      await axiosInstance.delete(`/course/contents/${lesson.id}`);
      onChanged();
    } catch {
      setError("We couldn’t delete this lesson. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-editor-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/35"
        onClick={onClose}
        aria-label="Close lesson editor"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-foreground/10 bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-foreground/10 bg-background px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold text-custom-purple">
              Learning lesson
            </p>
            <h2 id="lesson-editor-title" className="mt-1 text-xl font-bold">
              Edit lesson
            </h2>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-lg hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
            aria-label="Close lesson editor"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <form className="grid gap-5 p-5 sm:p-6" onSubmit={save}>
          <TextField
            name="title"
            label="Lesson title"
            required
            defaultValue={lesson.title}
          />
          <label className="grid gap-1.5 text-sm font-semibold text-foreground/80">
            Access
            <select
              name="content_visibility"
              defaultValue={lesson.content_visibility}
              className="min-h-11 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            >
              <option value="PREVIEW">Preview</option>
              <option value="ENROLLED">Enrolled learners</option>
            </select>
          </label>
          <TextField
            name="description"
            label="Short description"
            defaultValue={lesson.description ?? ""}
          />
          <label className="grid gap-1.5 text-sm font-semibold text-foreground/80">
            Lesson text
            <textarea
              name="text_content"
              rows={6}
              defaultValue={lesson.text_content ?? ""}
              className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
            />
          </label>
          <AssetFields current={lesson} />
          {error && <Notice>{error}</Notice>}
          <div className="mt-1 flex flex-col-reverse gap-3 border-t border-foreground/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={deleteLesson}
              disabled={isDeleting || isSaving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-500/10 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-red-300"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {isDeleting ? "Deleting…" : "Delete lesson"}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 rounded-lg px-4 text-sm font-bold hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="min-h-11 rounded-lg bg-custom-purple px-4 text-sm font-bold text-[#24172b] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}

function AssetFields({
  formKey,
  current,
}: {
  formKey?: number;
  current?: courseTypes.ModuleContent;
}) {
  return (
    <fieldset className="grid gap-3 rounded-lg bg-foreground/[0.025] p-3">
      <legend className="px-1 text-xs font-semibold text-foreground/70">
        Lesson assets{" "}
        <span className="font-normal">
          Optional — choose a new file to replace the current one
        </span>
      </legend>
      <div className="grid gap-3 sm:grid-cols-3">
        <UploadField
          key={`attachment-${formKey ?? "edit"}`}
          name="attachment"
          label="Attachment"
          hint={
            current?.attachment?.original_name ||
            "Documents or supporting files"
          }
          accept="*/*"
          icon={<FileText className="size-4" aria-hidden="true" />}
        />
        <UploadField
          key={`video-${formKey ?? "edit"}`}
          name="video"
          label="Video"
          hint={current?.video?.original_name || "Video files"}
          accept="video/*"
          icon={<Film className="size-4" aria-hidden="true" />}
        />
        <UploadField
          key={`thumbnail-${formKey ?? "edit"}`}
          name="thumbnail"
          label="Thumbnail"
          hint={
            current?.thumbnail?.original_name || "Image shown for the video"
          }
          accept="image/*"
          icon={<ImageIcon className="size-4" aria-hidden="true" />}
        />
      </div>
    </fieldset>
  );
}
function TextField({
  name,
  label,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-foreground/70">
      {label} {required && <span className="font-normal">Required</span>}
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="min-h-10 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
      />
    </label>
  );
}
function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-3 flex items-center gap-2 text-sm text-custom-orange"
      role="alert"
    >
      <CircleAlert className="size-4" aria-hidden="true" />
      {children}
    </p>
  );
}
function fileFrom(form: FormData, name: string) {
  const value = form.get(name);
  return value instanceof File && value.size ? value : null;
}
async function uploadAsset(
  file: File,
  kind: "attachment" | "video" | "thumbnail",
) {
  const data = new FormData();
  data.append("file", file);
  data.append("kind", kind);
  const response = await axiosInstance.post<{ data: { id: string } }>(
    "/media/upload",
    data,
  );
  return response.data.data;
}
function UploadField({
  name,
  label,
  hint,
  accept,
  icon,
}: {
  name: string;
  label: string;
  hint: string;
  accept: string;
  icon: ReactNode;
}) {
  const [fileName, setFileName] = useState("");
  return (
    <label className="grid min-h-24 cursor-pointer content-center gap-1 rounded-lg border border-dashed border-foreground/20 bg-background px-3 py-2 text-xs font-semibold text-foreground/75 transition-colors hover:border-custom-purple/60 focus-within:border-custom-purple focus-within:ring-2 focus-within:ring-custom-purple/25">
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="truncate text-[11px] font-normal text-foreground/55">
        {fileName || hint}
      </span>
      <input
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}
