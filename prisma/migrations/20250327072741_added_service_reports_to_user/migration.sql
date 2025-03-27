/*
  Warnings:

  - Added the required column `serviceReporterId` to the `ServiceReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceReport" ADD COLUMN     "serviceReporterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_serviceReporterId_fkey" FOREIGN KEY ("serviceReporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
