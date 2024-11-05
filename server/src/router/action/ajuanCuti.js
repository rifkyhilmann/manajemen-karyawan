const prisma = require('../../../prisma/prismaClient');

exports.CreeateCuti = async (req, res) => {
    const {karyawanId, tanggal_mulai, tanggal_selesai, jenis_cuti, keterangan} = req.body;
    console.log(req.body);
    try {
        const Cuti = await prisma.cuti.create({
            data : {
                karyawanId : karyawanId,
                tanggal_mulai : tanggal_mulai,
                tanggal_selesai : tanggal_selesai,
                jenis_cuti : jenis_cuti,
                keterangan : keterangan
            }
        })

        res.status(200).send("Success")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error");
    }
}

exports.GetAllCuti = async (req, res) => {
    try {
        const cuti = await prisma.cuti.findMany({
            include: {
                karyawan: {
                    select: {
                        name: true // Only select the name field
                    }
                }
            }
        });

        // Format the dates and flatten the karyawan's name
        const formattedCuti = cuti.map((item) => ({
            id: item.id,
            karyawanId: item.karyawanId,
            name: item.karyawan.name, // Flatten the karyawan name to the root level
            tanggal_mulai: item.tanggal_mulai.toLocaleDateString('en-GB'), // Format as DD-MM-YYYY
            tanggal_selesai: item.tanggal_selesai.toLocaleDateString('en-GB'), // Format as DD-MM-YYYY
            jenis_cuti: item.jenis_cuti,
            status: item.status,
            keterangan: item.keterangan
        }));

        res.status(200).send(formattedCuti);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
};

exports.GetCutiWhereEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const cuti = await prisma.cuti.findMany({
            where: {
                karyawan: {
                    email: email, // Filter based on the email
                },
            },
            include: {
                karyawan: {
                    select: {
                        name: true // Only select the name field
                    }
                }
            }
        });

        // Format the dates and flatten the karyawan's name
        const formattedCuti = cuti.map((item) => ({
            id: item.id,
            karyawanId: item.karyawanId,
            name: item.karyawan.name, // Flatten the karyawan name to the root level
            tanggal_mulai: item.tanggal_mulai.toLocaleDateString('en-GB'), // Format as DD-MM-YYYY
            tanggal_selesai: item.tanggal_selesai.toLocaleDateString('en-GB'), // Format as DD-MM-YYYY
            jenis_cuti: item.jenis_cuti,
            status: item.status,
            keterangan: item.keterangan
        }));

        res.status(200).send(formattedCuti);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
};

exports.ApproveCuti = async (req, res) => {
    const { idCuti } = req.params;
    try {
        const id = parseInt(idCuti);
        const cuti = await prisma.cuti.findUnique({
            where: { id: id },
        });

        if (!cuti) {
            return res.status(404).send("Leave request not found");
        }

        if (cuti.status === "APPROVED") {
            return res.status(301).send("Cuti Sudah di approved");
        }
        if (cuti.status === "REJECTED") {
            return res.status(302).send("Cuti Sudah di rejected");
        }

        // Update the status to "Approved"
        const updatedCuti = await prisma.cuti.update({
            where: { id: id },
            data: { status: "APPROVED" },
        });

        // Calculate the number of days and create attendance records
        const startDate = new Date(cuti.tanggal_mulai);
        const endDate = new Date(cuti.tanggal_selesai);
        const attendanceRecords = [];

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            attendanceRecords.push({
                karyawanId: cuti.karyawanId,
                tanggal: new Date(d),
                status: "CUTI",
                keterangan: cuti.jenis_cuti // or whatever detail you want
            });
        }

        await prisma.absensi.createMany({
            data: attendanceRecords
        });

        res.status(200).send("Succes");

    } catch (error) {
        console.log(error);
        res.status(500).send("Error approving leave request");
    }
};

exports.RejectedCuti = async (req, res) => {
    const { idCuti } = req.params

    try {
        const cuti = await prisma.cuti.findUnique({
            where: { id: parseInt(idCuti) }
        });

        if (cuti.status === "APPROVED") {
            return res.status(301).send("Cuti Sudah di approved");
        }
        if (cuti.status === "REJECTED") {
            return res.status(302).send("Cuti Sudah di rejected");
        }

        if(!cuti) {
            return res.status(404).send("Cuti not foung");
        }

        await prisma.cuti.update({
            where: { id: parseInt(idCuti) },
            data: { status: "REJECTED" }
        });

        res.status(200).send("Success rejected status cuti")
    } catch (error) {   
        console.log(error);
        res.status(500).send("Error approving leave request");
    }
}