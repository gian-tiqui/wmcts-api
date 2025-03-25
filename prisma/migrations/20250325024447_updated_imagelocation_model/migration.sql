-- DropForeignKey
ALTER TABLE "ImageLocation" DROP CONSTRAINT "ImageLocation_serviceReportId_fkey";

-- AlterTable
ALTER TABLE "ImageLocation" ALTER COLUMN "serviceReportId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ImageLocation" ADD CONSTRAINT "ImageLocation_serviceReportId_fkey" FOREIGN KEY ("serviceReportId") REFERENCES "ServiceReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
