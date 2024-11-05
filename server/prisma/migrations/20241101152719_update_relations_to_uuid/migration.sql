/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `karyawan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `karyawan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "absensi" DROP CONSTRAINT "absensi_karyawanId_fkey";

-- DropForeignKey
ALTER TABLE "cuti" DROP CONSTRAINT "cuti_karyawanId_fkey";

-- AlterTable
ALTER TABLE "absensi" ALTER COLUMN "karyawanId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "admin" DROP CONSTRAINT "admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "admin_id_seq";

-- AlterTable
ALTER TABLE "cuti" ALTER COLUMN "karyawanId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "karyawan" DROP CONSTRAINT "karyawan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "karyawan_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_id_key" ON "karyawan"("id");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuti" ADD CONSTRAINT "cuti_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
