const prisma = require('../../../prisma/prismaClient');

exports.AbsensiMasuk = async (req, res) => {
    const { karyawanId } = req.body;

    try {
        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                karyawanId: parseInt(karyawanId),
                tanggal: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)), // Awal hari
                    lt: new Date(new Date().setHours(23, 59, 59, 999)), // Akhir hari
                },
            },
        });

        if (!existingAbsensi) {
            const absensiMasuk = await prisma.absensi.create({
                data: {
                    karyawanId: parseInt(karyawanId),
                    tanggal: new Date(),
                    jam_masuk: new Date(),
                },
            });

            return res.status(201).json({
                message: 'Absensi masuk berhasil dicatat',
            });
        } else {
            return res.status(400).json({
                message: 'Karyawan sudah melakukan absensi masuk hari ini',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mencatat absensi masuk',
            error: error.message,
        });
    }
}

// Fungsi untuk mencatat absensi pulang
exports.AbsensiPulang = async (req, res) => {
    const { karyawanId } = req.body; // Ambil ID karyawan dari body request

    try {
        // Cek apakah sudah ada absensi masuk untuk karyawan ini pada hari ini
        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                karyawanId: parseInt(karyawanId),
                tanggal: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)), // Awal hari
                    lt: new Date(new Date().setHours(23, 59, 59, 999)), // Akhir hari
                },
            },
        });

        // Jika sudah ada absensi masuk, catat absensi pulang
        if (existingAbsensi) {
            const updatedAbsensi = await prisma.absensi.update({
                where: { id: existingAbsensi.id }, // Temukan absensi yang sudah ada
                data: {
                    jam_keluar: new Date(), // Waktu jam pulang
                    status: 'HADIR', // Anda dapat menyesuaikan status jika diperlukan
                },
            });

            return res.status(200).json({
                message: 'Absensi pulang berhasil dicatat',
            });
        } else {
            return res.status(400).json({
                message: 'Karyawan belum melakukan absensi masuk hari ini',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mencatat absensi pulang',
            error: error.message,
        });
    }
};