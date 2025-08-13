/*
  Warnings:

  - You are about to drop the `_UserMentions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserMentions" DROP CONSTRAINT "_UserMentions_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserMentions" DROP CONSTRAINT "_UserMentions_B_fkey";

-- DropTable
DROP TABLE "_UserMentions";
