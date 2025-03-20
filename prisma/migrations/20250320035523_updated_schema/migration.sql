/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `LogType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `methodId` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `LogType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedUserId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "methodId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LogType" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "acknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "assignedUserId" INTEGER NOT NULL,
ADD COLUMN     "issuerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "activity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorityLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriorityLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogMethod" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriorityLevel_name_key" ON "PriorityLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LogMethod_method_key" ON "LogMethod"("method");

-- CreateIndex
CREATE UNIQUE INDEX "LogType_type_key" ON "LogType"("type");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "LogMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
