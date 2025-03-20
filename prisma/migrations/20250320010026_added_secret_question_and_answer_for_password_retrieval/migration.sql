-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secretAnswer" TEXT,
ADD COLUMN     "secretQuestionId" INTEGER;

-- CreateTable
CREATE TABLE "SecretQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecretQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_secretQuestionId_fkey" FOREIGN KEY ("secretQuestionId") REFERENCES "SecretQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
