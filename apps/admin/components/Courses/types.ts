import type { courseTypes } from "@sd/types";

export type Course = Omit<courseTypes.Course, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type CourseResponse = { data: Course[] };
export type StatusFilter = "ALL" | Course["publish_status"];

export const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All courses" },
  { value: "PUBLISHED", label: "Published" },
  { value: "UN_PUBLISHED", label: "Unpublished" },
];
