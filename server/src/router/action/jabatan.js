const prisma = require('../../../prisma/prismaClient');

exports.GetAllJabatan = async (req, res) => {
    try {
        const data = await prisma.jabatan.findMany();
        
        if(!data) {
            return res.status(404).send("Data not found")
        }

        res.status(200).json({
            message : "Success",
            data : data
        })
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.CreateJabatan = async (req, res) => {
    const { nama_jabatan, gaji_per_hari } = req.body;

    try {
        const jabatan = await prisma.jabatan.create({
            data : {
                nama_jabatan : nama_jabatan,
                gaji_per_hari : parseFloat(gaji_per_hari)
            }
        })

        res.status(200).send("succes")
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}

exports.UpdateJabatan = async (req, res) => {
    const { id } = req.params;
    const { nama_jabatan, gaji_per_hari } = req.body;

    try {
        const jabatan = await prisma.jabatan.update({
            where : {
                id : parseInt(id)
            },
            data : {
                nama_jabatan : nama_jabatan,
                gaji_per_hari : parseFloat(gaji_per_hari)
            }
        })

        res.status(200).send("succes")
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }

}

exports.DeleteJabatan = async (req, res) => {
    const { id } = req.params;

    try {
        const jabatan = await prisma.jabatan.delete({
            where : {
                id  : parseInt(id)
            }
        })

        res.status(200).send("succes")
    } catch (error) {
        res.status(500).send("Error")
        console.log(error)
    }
}