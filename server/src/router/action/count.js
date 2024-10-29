const prisma = require('../../../prisma/prismaClient');

exports.CountKaryawan = async (req, res) => {
    try {
        const karayawan = await prisma.karyawan.count();

        res.status(200).json(karayawan)
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)     
    }
}