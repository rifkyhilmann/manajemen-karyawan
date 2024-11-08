-- DropForeignKey
ALTER TABLE "absensi" DROP CONSTRAINT "absensi_karyawanId_fkey";

-- DropForeignKey
ALTER TABLE "cuti" DROP CONSTRAINT "cuti_karyawanId_fkey";

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuti" ADD CONSTRAINT "cuti_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
