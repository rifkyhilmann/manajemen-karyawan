/*
  Warnings:

  - The `status` column on the `absensi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusAbsensi" AS ENUM ('HADIR', 'SAKIT', 'CUTI', 'IZIN', 'ALFA');

-- AlterTable
ALTER TABLE "absensi" DROP COLUMN "status",
ADD COLUMN     "status" "StatusAbsensi" NOT NULL DEFAULT 'ALFA';
