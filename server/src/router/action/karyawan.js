const prisma = require('../../../prisma/prismaClient');
const bcrypt = require('bcrypt');

exports.CreateKaryawan = async (req, res) => {
    const { nip, name, password, alamat, no_hp, email, jabatanId } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null; // Ubah undefined ke null

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const karyawan = await prisma.karyawan.create({
            data: {
                nip: nip,
                name: name,
                password: hashedPassword,
                alamat: alamat,
                no_hp: no_hp,
                email: email,
                jabatanId: parseInt(jabatanId),
                ...(image && { image }), // Menyimpan image hanya jika ada
            },
        });

        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Error");
        console.log(error);
    }
}

exports.GetKaryawanById = async (req, res) => {
    const {id} = req.params;

    try {
        const data = await prisma.karyawan.findUnique({
            where : {
                id : id
            }
        })

        res.status(200).json(data)
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}
exports.GetKaryawanByEmail = async (req, res) => {
    const {email} = req.params;

    try {
        const karyawan = await prisma.karyawan.findMany({
            where : {
                email : email
            },
            select: {
                id: true,
                nip: true,
                name: true,
                alamat: true,
                no_hp: true,
                email: true,
                jabatanId: true,
                image: true,
                createdAt: true,
                jabatan: {
                    select: {
                        nama_jabatan: true, // Ambil nama_jabatan
                    },
                },
            },
        });
        
        // Ubah struktur data sebelum dikembalikan
        const karyawanWithJabatan = karyawan.map(k => ({
            ...k,
            jabatan: k.jabatan?.nama_jabatan || 'Tidak Ada' // Mengubah jabatan menjadi string
        }));

        res.status(200).json(karyawanWithJabatan);
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.DeleteKaryawan = async (req, res) => {
    const {id} = req.params;

    try {
        const data = await prisma.karyawan.delete({
            where : {
                id : id
            }
        })

        res.status(200).json("success")
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.UpdateKaryawan = async (req, res) => {
    const { id } = req.params;
    const { nip, name, alamat, no_hp, jabatanId } = req.body; 
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;

    const updateData = {
        nip,
        name,
        alamat,
        no_hp,
        jabatanId: jabatanId ? Number(jabatanId) : undefined, // Pastikan jabatanId diubah ke Number jika ada
    };

    if (image) {
        updateData.image = image;
    }

    try {
        // Mencari karyawan berdasarkan ID dan memperbarui datanya
        const karyawan = await prisma.karyawan.update({
            where: { id }, // Mencari karyawan berdasarkan ID
            data: updateData, // Menggunakan data yang sudah disiapkan
            include: { // Termasuk data jabatan dalam hasil
                jabatan: true,
            }
        });

        if (!karyawan) {
            console.log("Update gagal: karyawan tidak ditemukan");
            return res.status(404).send('Karyawan tidak ditemukan');
        }

        // Ubah struktur data untuk mencocokkan dengan struktur pada GetKaryawanByEmail
        const karyawanWithJabatan = {
            ...karyawan,
            jabatan: karyawan.jabatan?.nama_jabatan || 'Tidak Ada', // Mengubah jabatan menjadi string
        };

        // Mengembalikan data yang sudah dipetakan
        res.status(200).json(karyawanWithJabatan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui karyawan' });
    }
};


exports.GetAllKaryawan = async (req, res) => {
    try {
        const karyawan = await prisma.karyawan.findMany({
            select: {
                id: true,
                nip: true,
                name: true,
                alamat: true,
                no_hp: true,
                email: true,
                jabatanId: true,
                image: true,
                createdAt: true,
                // Ambil nama_jabatan langsung
                jabatan: {
                    select: {
                        nama_jabatan: true, // Ambil nama_jabatan
                    },
                },
            },
        });
        
        // Ubah struktur data sebelum dikembalikan
        const karyawanWithJabatan = karyawan.map(k => ({
            ...k,
            jabatan: k.jabatan?.nama_jabatan || 'Tidak Ada' // Mengubah jabatan menjadi string
        }));

        res.status(200).json(karyawanWithJabatan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' });
    }
};
