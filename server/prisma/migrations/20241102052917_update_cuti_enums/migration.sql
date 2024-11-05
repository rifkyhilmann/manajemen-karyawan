/*
  Warnings:

  - The `status` column on the `cuti` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusCuti" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "cuti" DROP COLUMN "status",
ADD COLUMN     "status" "StatusCuti" NOT NULL DEFAULT 'PENDING';
