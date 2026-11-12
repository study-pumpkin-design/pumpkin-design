import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { statusOptions, type StatusFilter } from "./types";

type CoursesToolbarProps = {
  isLoading: boolean;
  searchInput: string;
  statusFilter: StatusFilter;
  onSearchInputChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSubmit: () => void;
  onCreateCourse: () => void;
};

export function CoursesToolbar({
  isLoading,
  searchInput,
  statusFilter,
  onSearchInputChange,
  onStatusFilterChange,
  onSubmit,
  onCreateCourse,
}: CoursesToolbarProps) {
  return (
    <form
      className="mt-6 grid gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-3 sm:grid-cols-[minmax(0,1fr)_190px_auto_auto] sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="relative">
        <label htmlFor="course-search" className="sr-only">
          Search courses
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground/45"
          aria-hidden="true"
        />
        <input
          id="course-search"
          type="search"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search by course name, description, or topic"
          className="min-h-12 w-full rounded-xl border border-foreground/15 bg-background py-3 pr-4 pl-11 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
        />
      </div>
      <div className="relative">
        <label htmlFor="course-status" className="sr-only">
          Filter courses by status
        </label>
        <Filter
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/55"
          aria-hidden="true"
        />
        <select
          id="course-status"
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(event.target.value as StatusFilter)
          }
          className="min-h-12 w-full appearance-none rounded-xl border border-foreground/15 bg-background py-3 pr-10 pl-10 text-sm font-medium text-foreground outline-none transition-colors focus:border-custom-purple focus:ring-2 focus:ring-custom-purple/25"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-foreground/55"
          aria-hidden="true"
        />
      </div>
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-custom-purple px-5 text-sm font-bold text-[#24172b] shadow-[0_8px_20px_-10px_rgba(204,114,247,0.9)] transition-colors hover:bg-[#d98afa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
      >
        <Search className="size-4" aria-hidden="true" />
        Search
      </button>
      <button
        type="button"
        onClick={onCreateCourse}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-foreground/15 bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple"
      >
        <Plus className="size-4" aria-hidden="true" />
        New course
      </button>
    </form>
  );
}
