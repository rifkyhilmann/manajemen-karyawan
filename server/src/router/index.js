const express = require('express');
const { CreateJabatan, GetAllJabatan, UpdateJabatan, DeleteJabatan } = require('./action/jabatan');
const { CreateKaryawan, DeleteKaryawan, UpdateKaryawan, GetAllKaryawan, GetKaryawanById, GetKaryawanByEmail } = require('./action/karyawan');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { Loginkaryawan, LoginAdmin } = require('./action/login');
const { AbsensiMasuk, AbsensiPulang, GetAllAbsensi, GetAbsensiWhereEmail } = require('./action/absensi');
const { CreateAdmin, GetAdminByEmail } = require('./action/admin');
const { CountKaryawan } = require('./action/count');
const { CreeateCuti, GetAllCuti, ApproveCuti, RejectedCuti, GetCutiWhereEmail } = require('./action/ajuanCuti');
const { GetCount } = require('./action/GetCount');

router.get('/jabatan', GetAllJabatan);
router.get('/karyawan/:id', GetKaryawanById);
router.get('/karyawan-by/:email', GetKaryawanByEmail);
router.get('/karyawan', GetAllKaryawan);
router.get('/admin/:email', GetAdminByEmail);
router.get('/count-karyawan', CountKaryawan);
router.get('/absensi', GetAllAbsensi)
router.get('/cuti', GetAllCuti)
router.get('/cuti/:email', GetCutiWhereEmail)
router.get('/count', GetCount);
router.get('/absensi/:email', GetAbsensiWhereEmail)

router.post('/jabatan', CreateJabatan);
router.post('/karyawan', upload.single('image'), CreateKaryawan);
router.post('/admin', upload.single('image'), CreateAdmin);
router.post('/karyawan/login', Loginkaryawan);
router.post('/admin/login', LoginAdmin);
router.post('/absen-masuk/:karyawanId', AbsensiMasuk);
router.post('/absen-pulang/:karyawanId', AbsensiPulang);
router.post('/cuti', CreeateCuti);
router.post('/cuti/approve/:idCuti', ApproveCuti);
router.post('/cuti/rejected/:idCuti', RejectedCuti);

router.put('/jabatan/:id', UpdateJabatan);
router.put('/karyawan/:id', UpdateKaryawan);

router.delete('/jabatan/:id', DeleteJabatan);
router.delete('/karyawan/:id', DeleteKaryawan);


module.exports = router;