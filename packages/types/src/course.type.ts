export interface Course {
  id: string;
  name: string;
  description: string;
  learning_outcomes: string[];
  course_topics: string[];
  modules?: Module[];
  publish_status: "PUBLISHED" | "UN_PUBLISHED";
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCourseDTO = Omit<
  Course,
  "id" | "createdAt" | "updatedAt" | "modules"
>;

export type UpdateCourseDTO = Partial<Course> & { id: string };

export interface Module {
  id: string;
  name: string;
  courseId: string;
  course?: Course;
  contents?: ModuleContent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleContent {
  id: string;
  title: string;
  description: string | null;
  text_content: string | null;
  attached_media: string | null;
  attachment?: MediaAsset | null;
  video_content: string | null;
  video?: MediaAsset | null;
  video_thumbnail: string | null;
  thumbnail?: MediaAsset | null;
  content_visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAsset {
  id: string;
  assetId: string;
  storage_medium: StorageMedium;
  original_name: string;
  mime_type: string;
  moduleAttachments?: ModuleContent[];
  moduleVideos?: ModuleContent[];
  moduleThumbnails?: ModuleContent[];
  createdAt: Date;
  updatedAt: Date;
}

export enum StorageMedium {
  AWS_S3 = "AWS_S3",
  CLOUDINARY = "CLOUDINARY",
}
