const prisma = require('../../../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

exports.Loginkaryawan = async (req, res) => {
    const {email, password} = req.body;

    if (!email && !password) {
        return res.status(403).send("email and password required")
    }

    try {
        const karyawan = await prisma.karyawan.findUnique({
            where : {
                email : email,
            }
        })

        if (!karyawan || !(await bcrypt.compare(password, karyawan.password))) {
            return res.status(400).send("password incorrect");
        }

        const tokenPayload = {
            id : karyawan.id,
            name : karyawan.name,
            role: 'karyawan',
        }

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn : '1h' })

        await prisma.karyawan.update({
            where : {
                email : karyawan.email,
            },
            data : {
                token : token
            }
        })

        res.status(200).json({
            message : "succes",
            token : token
        })
    } catch (error) {
        console.error( error);
        return res.status(500).send(error)
    }
}

exports.LoginAdmin = async (req, res) => {
    const {email, password} = req.body;

    if (!email && !password) {
        return res.status(403).send("email and password required")
    }

    try {
        const admin = await prisma.admin.findUnique({
            where : {
                email : email,
            }
        })

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(400).send("password incorrect");
        }

        const tokenPayload = {
            id : admin.id,
            name : admin.name,
            role: 'admin',
        }

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn : '1h' })

        await prisma.admin.update({
            where : {
                email : admin.email,
            },
            data : {
                token : token
            }
        })

        res.status(200).json({
            message : "succes",
            token : token
        })
    } catch (error) {
        console.error( error);
        return res.status(500).send(error)
    }
}