/*
  Warnings:

  - You are about to drop the column `request` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "request",
ADD COLUMN     "network" JSONB;
