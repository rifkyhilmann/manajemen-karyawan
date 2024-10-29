const prisma = require('../../../prisma/prismaClient');
const bcrypt = require('bcrypt');

exports.CreateAdmin = async (req, res) => {
    const {name, password, email, no_hp} = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data : {
                name : name,
                password : hashedPassword,
                email : email,
                no_hp : no_hp,
                image : image
            }
        })

        res.status(200).send("Succes")
    } catch (error) {
        console.error( error);
        return res.status(500).send(error)
    }
}

exports.GetAdminByEmail = async (req, res) => {
    const {email} = req.params;

    try {
        const admin = await prisma.admin.findUnique({
            where : {
                email : email
            }
        })

        if(!admin) {
            return res.status(404).send("Admin not found")
        }

        res.status(200).json(admin)
    } catch (error) {
        console.error( error);
        return res.status(500).send(error)
    }
}