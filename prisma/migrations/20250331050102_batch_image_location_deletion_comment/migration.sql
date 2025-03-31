-- DropForeignKey
ALTER TABLE "ImageLocation" DROP CONSTRAINT "ImageLocation_commentId_fkey";

-- AddForeignKey
ALTER TABLE "ImageLocation" ADD CONSTRAINT "ImageLocation_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
