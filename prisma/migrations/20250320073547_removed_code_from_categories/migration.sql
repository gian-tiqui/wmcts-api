/*
  Warnings:

  - You are about to drop the column `code` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedUserId_fkey";

-- DropIndex
DROP INDEX "Category_code_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "assignedUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
