const express = require('express');
const { CreateJabatan, GetAllJabatan, UpdateJabatan, DeleteJabatan } = require('./action/jabatan');
const { CreateKaryawan, GetKaryawanByEmail, DeleteKaryawan, UpdateKaryawan, GetAllKaryawan } = require('./action/karyawan');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { Loginkaryawan, LoginAdmin } = require('./action/login');
const { AbsensiMasuk, AbsensiPulang } = require('./action/absensi');
const { CreateAdmin, GetAdminByEmail } = require('./action/admin');
const { CountKaryawan } = require('./action/count');

router.get('/jabatan', GetAllJabatan);
router.get('/karyawan/:email', GetKaryawanByEmail);
router.get('/karyawan', GetAllKaryawan);
router.get('/admin/:email', GetAdminByEmail);
router.get('/count-karyawan', CountKaryawan);

router.post('/jabatan', CreateJabatan);
router.post('/karyawan', upload.single('image'), CreateKaryawan);
router.post('/admin', upload.single('image'), CreateAdmin);
router.post('/karyawan/login', Loginkaryawan);
router.post('/admin/login', LoginAdmin);
router.post('/absen-masuk', AbsensiMasuk);
router.post('/absen-pulang', AbsensiPulang);

router.put('/jabatan/:id', UpdateJabatan);
router.put('/karyawan/:email', UpdateKaryawan);

router.delete('/jabatan/:id', DeleteJabatan);
router.delete('/karyawan/:email', DeleteKaryawan);


module.exports = router;