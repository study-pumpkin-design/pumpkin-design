/*
  Warnings:

  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ModuleContent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageMedium" AS ENUM ('AWS', 'CLOUDINARY');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ModuleContent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "text_content" DROP NOT NULL,
ALTER COLUMN "attached_media" DROP NOT NULL,
ALTER COLUMN "video_content" DROP NOT NULL,
ALTER COLUMN "video_thumbnail" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "storage_medium" "StorageMedium" NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModuleContent" ADD CONSTRAINT "ModuleContent_attached_media_fkey" FOREIGN KEY ("attached_media") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleContent" ADD CONSTRAINT "ModuleContent_video_content_fkey" FOREIGN KEY ("video_content") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleContent" ADD CONSTRAINT "ModuleContent_video_thumbnail_fkey" FOREIGN KEY ("video_thumbnail") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
