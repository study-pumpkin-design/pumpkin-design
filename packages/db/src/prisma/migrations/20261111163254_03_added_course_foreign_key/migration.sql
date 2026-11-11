/*
  Warnings:

  - Added the required column `module_id` to the `ModuleContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModuleContent" ADD COLUMN     "module_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ModuleContent" ADD CONSTRAINT "ModuleContent_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
