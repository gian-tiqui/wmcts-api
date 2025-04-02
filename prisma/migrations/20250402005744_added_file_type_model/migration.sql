/*
  Warnings:

  - Added the required column `fileTypeId` to the `ImageLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageLocation" ADD COLUMN     "fileTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FileType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileType_type_key" ON "FileType"("type");

-- AddForeignKey
ALTER TABLE "ImageLocation" ADD CONSTRAINT "ImageLocation_fileTypeId_fkey" FOREIGN KEY ("fileTypeId") REFERENCES "FileType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
