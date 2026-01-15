/*
  Warnings:

  - Added the required column `title` to the `Guide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "title" TEXT NOT NULL;
