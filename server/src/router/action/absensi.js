const prisma = require('../../../prisma/prismaClient');

exports.AbsensiMasuk = async (req, res) => {
    const { karyawanId } = req.params;
    
    try {
        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                karyawanId: karyawanId,
                tanggal: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)), // Awal hari
                    lt: new Date(new Date().setHours(23, 59, 59, 999)), // Akhir hari
                },
            },
        });

        if (!existingAbsensi) {
            const absensiMasuk = await prisma.absensi.create({
                data: {
                    karyawanId: karyawanId,
                    tanggal: new Date(),
                    jam_masuk: new Date(),
                },
            });

            return res.status(200).json({
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
    const { karyawanId } = req.params; // Ambil ID karyawan dari body request

    try {
        // Cek apakah sudah ada absensi masuk untuk karyawan ini pada hari ini
        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                karyawanId: karyawanId,
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
exports.GetAllAbsensi = async (req, res) => {
    try {
        const absensi = await prisma.absensi.findMany({
            include: {
                karyawan: { // Include the Karyawan data
                    select: {
                        name: true, // Select only the name field
                    },
                },
            },
        });

        if (!absensi || absensi.length === 0) {
            return res.status(404).json({ message: "Absensi not found" });
        }

        // Format the date and time
        const formattedAbsensi = absensi.map(item => ({
            id: item.id,
            karyawanId: item.karyawanId,
            name: item.karyawan.name, // Add the employee name
            tanggal: formatDate(item.tanggal),
            jam_masuk: formatTime(item.jam_masuk),
            jam_keluar: formatTime(item.jam_keluar), // Include original jam_keluar
            status: item.status,
            keterangan: item.keterangan,
            jam_pulang: formatTime(item.jam_pulang), // Ensure jam_pulang is formatted correctly
        }));

        res.status(200).json({
            message: 'success',
            data: formattedAbsensi
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send("Server error");
    }
}

exports.GetAbsensiWhereEmail = async (req, res) => {
    const {email} = req.params

    try {
        const absensi = await prisma.absensi.findMany({
            where: {
                karyawan: {
                    email: email, // Menggunakan email untuk mencari karyawan
                },
            },
            include: {
                karyawan: { // Include the Karyawan data
                    select: {
                        name: true, // Select only the name field
                    },
                },
            },
        });

        if (!absensi || absensi.length === 0) {
            return res.status(404).json({ message: "Absensi not found" });
        }

        // Format the date and time
        const formattedAbsensi = absensi.map(item => ({
            id: item.id,
            karyawanId: item.karyawanId,
            name: item.karyawan.name, // Add the employee name
            tanggal: formatDate(item.tanggal),
            jam_masuk: item.jam_masuk ? formatTime(item.jam_masuk) : "00:00", // Ganti dengan "00:00" jika tidak ada
            jam_keluar: item.jam_keluar ? formatTime(item.jam_keluar) : "00:00",// Include original jam_keluar
            status: item.status,
            keterangan: item.keterangan,
            jam_pulang: formatTime(item.jam_pulang), // Ensure jam_pulang is formatted correctly
        }));

        res.status(200).json({
            message: 'success',
            data: formattedAbsensi
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send("Server error");
    }
}

// Helper functions to format date and time
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(timeString).toLocaleTimeString('id-ID', options);
}

const getMonth = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${month}/${year}`
}

exports.GetCountAbsensi = async (req, res) => {
    const { karyawanId } = req.params;  

    try {
        const today = new Date();
        const month = today.getMonth() + 1;  
        const year = today.getFullYear();    

        const startOfMonth = new Date(year, month - 1, 1);  
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(year, month, 0); 
        endOfMonth.setHours(23, 59, 59, 999);  

        const result = await prisma.absensi.findMany({
            where: {
                tanggal: {
                    gte: startOfMonth,  
                    lte: endOfMonth,    
                },
                karyawanId : karyawanId
            }
        });

        const status = {
            HADIR : 0,
            SAKIT : 0,
            CUTI : 0,
            IZIN : 0,
            ALFA : 0,
        }

        result.forEach(item => {
            if(item.status === "HADIR") {
                status.HADIR++;
            } else if(item.status === "SAKIT") {
                status.SAKIT++;
            } else if (item.status === "CUTI") {
                status.CUTI++;
            } else if (item.status === "IZIN") {
                status.IZIN++;
            } else if (item.status === "ALFA") {
                status.ALFA++
            }
        })

        const statusArray = Object.keys(status).map(key => ({
            status: key,
            jumlah: status[key]
        }));
      
        res.status(200).json({
            message: "success",
            data: statusArray
        });
        
    } catch (error) {
        console.error(error);  
        res.status(500).send({ message: "Internal server error" });
    }
};

exports.CheckAbsensi = async (req, res) => {
    const { karyawanId } = req.params;
    const today = new Date();

    // Format tanggal tanpa waktu (hanya tanggal)
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Awal hari: 2024-11-06 00:00:00
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Akhir hari: 2024-11-06 23:59:59

    try {
        const result = await prisma.absensi.findMany({
            where: {
                karyawanId: karyawanId,
                tanggal: {
                    gte: startOfDay, // Pencarian absensi yang dimulai dari tengah malam
                    lt: endOfDay,    // Pencarian absensi yang berakhir sebelum tengah malam hari berikutnya
                }
            }
        });


        const absensi = {
            masuk: false, 
            pulang: false, 
            status: "", // Status default kosong
        };

        // Jika ada data absensi, kita periksa apakah jam masuk dan keluar ada
        result.forEach((entry) => {
            if (entry.jam_masuk && entry.jam_masuk !== "") {
                absensi.masuk = true;  // Menandakan sudah absensi masuk
            }

            if (entry.jam_keluar && entry.jam_keluar !== "") {
                absensi.pulang = true;  // Menandakan sudah absensi keluar
            }

            // Jika ada field status, kita ambil statusnya
            if (entry.status) {
                absensi.status = entry.status;  // Mengambil status dari entri
            }
        });

        // Kirimkan status absensi
        res.status(200).json({
            message: "success",
            data: absensi
        });

    } catch (error) {
        console.error("Error checking absensi:", error);
        res.status(500).json({
            message: "Error checking absensi",
            error: error.message,
        });
    }
};
