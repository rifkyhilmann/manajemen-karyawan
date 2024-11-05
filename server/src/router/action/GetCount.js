const prisma = require('../../../prisma/prismaClient');

exports.GetCount = async (req, res) => {
    try {
        const karyawan = await prisma.karyawan.count();
        const cuti = await prisma.cuti.count();

        const data = {
            karyawan : karyawan,
            cuti : cuti,
        }

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error");
    }
}