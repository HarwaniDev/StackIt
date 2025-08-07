/*
  Warnings:

  - You are about to drop the column `questionId` on the `votes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_questionId_fkey";

-- DropIndex
DROP INDEX "votes_userId_questionId_key";

-- AlterTable
ALTER TABLE "votes" DROP COLUMN "questionId";
