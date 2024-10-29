const prisma = require('../../../prisma/prismaClient');
const bcrypt = require('bcrypt');

exports.CreateKaryawan = async (req, res) => {
    const {nip, name, password, alamat, no_hp, email, jabatanId} = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const karyawan = await prisma.karyawan.create({
            data : {
                nip : nip,
                name : name,
                password : hashedPassword,
                alamat : alamat,
                no_hp : no_hp,
                email : email,
                jabatanId : parseInt(jabatanId),
                image : image
            }
        })

        res.status(200).send("Success")
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.GetKaryawanByEmail = async (req, res) => {
    const {email} = req.params;

    try {
        const data = await prisma.karyawan.findUnique({
            where : {
                email : email
            }
        })

        res.status(200).json(data)
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.DeleteKaryawan = async (req, res) => {
    const {email} = req.params;

    try {
        const data = await prisma.karyawan.delete({
            where : {
                email : email
            }
        })

        res.status(200).json("success")
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.UpdateKaryawan = async (req, res) => {
    const { email } = req.params;
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
        const karyawan = await prisma.karyawan.update({
            where: { email }, // Mencari karyawan berdasarkan email
            data: updateData, // Menggunakan data yang sudah disiapkan
        });

        res.status(200).send("Success");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui karyawan' });
    }
};

exports.GetAllKaryawan = async (req, res) => {
    try {
        const karyawan = await prisma.karyawan.findMany();

        if(!karyawan) {
            return res.status(404).send("Karyawan not found")
        }

        res.status(200).json(karyawan)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' });
    }
}