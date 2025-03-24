/*
  Warnings:

  - You are about to drop the column `userId` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_UserRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserRoles_B_index" ON "_UserRoles"("B");

-- AddForeignKey
ALTER TABLE "_UserRoles" ADD CONSTRAINT "_UserRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRoles" ADD CONSTRAINT "_UserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
