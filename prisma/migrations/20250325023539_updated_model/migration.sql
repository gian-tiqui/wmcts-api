/*
  Warnings:

  - Added the required column `title` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentId` to the `ImageLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImageLocation" ADD COLUMN     "commentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ImageLocation" ADD CONSTRAINT "ImageLocation_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
