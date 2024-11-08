import { useEffect, useState } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from "react-redux";
import { showDialog, showToast } from '../../utils/alertUtils';
import axios from 'axios';
import { GetData } from '../../utils/apiUtils';


const CardAbsensi = () => {
    // Mengambil data karyawan yang sedang login dari state Redux
    const karyawan = useSelector((state: RootState) => state.auth.karyawan);

    // Mendapatkan tanggal dan waktu saat ini
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    const currentHour = currentDate.getHours();

    // Waktu absensi masuk dan pulang disimpan dalam variabel
    const ABSENSI_MASUK_TIME = { start: 7, end: 9 };  // Waktu absensi masuk (07:00 - 08:00)
    const ABSENSI_PULANG_TIME = { start: 15, end: 17 }; // Waktu absensi pulang (12:00 - 17:00)

    // State untuk status absensi masuk dan pulang
    const [isAbsensiMasuk, setIsAbsensiMasuk] = useState(false);
    const [isAbsensiPulang, setIsAbsensiPulang] = useState(false);

    /**
     * Memeriksa status absensi karyawan untuk hari ini
     * dan mengatur state `isAbsensiMasuk` dan `isAbsensiPulang`
     */
    const fetchAbsensiStatus = async () => {
        try {
            const response = await GetData(`absensi/today-status/${karyawan?.id}`)
            setIsAbsensiMasuk(response?.data.data.masuk || false);
            setIsAbsensiPulang(response?.data.data.pulang || false);
            console.log(response?.data.data);
        } catch (error) {
            console.error("Error fetching absensi status:", error);
        }
    };

    useEffect(() => {
        if (karyawan?.id) fetchAbsensiStatus();
    }, [karyawan?.id]);

    /**
     * Menentukan judul dan rentang waktu absensi berdasarkan jam saat ini
     */
    const getAbsensiInfo = () => {
        if (currentHour >= ABSENSI_MASUK_TIME.start && currentHour <= ABSENSI_MASUK_TIME.end) {
            return { title: "Absensi Masuk", time: `${ABSENSI_MASUK_TIME.start}:00 - ${ABSENSI_MASUK_TIME.end}:00` };
        } else if (currentHour >= ABSENSI_PULANG_TIME.start && currentHour <= ABSENSI_PULANG_TIME.end) {
            return { title: "Absensi Pulang", time: `${ABSENSI_PULANG_TIME.start}:00 - ${ABSENSI_PULANG_TIME.end}:00` };
        } else {
            return { title: "Bukan Waktu Absensi", time: "" };
        }
    };
    const { title: Title, time: Time } = getAbsensiInfo();

    /**
     * Fungsi untuk melakukan absensi masuk
     */
    const handleAbsensiMasuk = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/absen-masuk/${karyawan?.id}`);
            if (response.status === 200) {
                showToast('success', 'Berhasil absen masuk');
                fetchAbsensiStatus();
            }
        } catch (error) {
            console.error("Error during absensi masuk:", error);
        }
    };

    /**
     * Fungsi untuk melakukan absensi pulang
     */
    const handleAbsensiPulang = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/absen-pulang/${karyawan?.id}`);
            if (response.status === 200) {
                showToast('success', 'Berhasil absen pulang');
                fetchAbsensiStatus();
            }
        } catch (error) {
            console.error("Error during absensi masuk:", error);
        }
    };

    /**
     * Fungsi untuk menangani aksi absensi sesuai dengan waktu
     * Memanggil `handleAbsensiMasuk` atau `handleAbsensiPulang` berdasarkan waktu dan status
     */
    const handleAbsensi = () => {
        if (currentHour >= ABSENSI_MASUK_TIME.start && currentHour <= ABSENSI_MASUK_TIME.end && !isAbsensiMasuk) {
            handleAbsensiMasuk();
        } else if (currentHour >= ABSENSI_PULANG_TIME.start && currentHour <= ABSENSI_PULANG_TIME.end && !isAbsensiPulang) {
            handleAbsensiPulang();
        } else {
            showDialog('warning', 'Bukan Waktu Absensi')
        }
    };

    /**
     * Menentukan keterangan absensi berdasarkan waktu dan status absensi
     */
    const getKeterangan = () => {
        if (currentHour >= ABSENSI_MASUK_TIME.start && currentHour <= ABSENSI_MASUK_TIME.end) {
            return isAbsensiMasuk ? "*Anda sudah absensi masuk" : "*Anda belum absensi masuk";
        } else if (currentHour >= ABSENSI_PULANG_TIME.start && currentHour <= ABSENSI_PULANG_TIME.end) {
            return isAbsensiPulang ? "*Anda sudah absensi pulang" : "*Anda belum absensi pulang";
        } else {
            return "*Bukan waktu absensi";
        }
    };
    const keterangan = getKeterangan();

    return (
        <div className="h-max min-h-[265px] flex flex-col rounded-xl border bg-white shadow-lg">
            <div className="h-14 bg-custom-gradient rounded-t-xl px-4 flex flex-col justify-center items-center text-white">
                <p className="font-medium text-md">Absensi</p>
                <p className="text-xs">{formattedDate}</p>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center flex-1 p-4">
                <p className="text-sm font-medium">{Title}</p>
                <p className="text-sm font-medium">{Time}</p>
                <div className="flex items-center gap-4 my-2">
                    <button
                        onClick={handleAbsensi}
                        disabled={(currentHour >= ABSENSI_MASUK_TIME.start && currentHour <= ABSENSI_MASUK_TIME.end && isAbsensiMasuk) || (currentHour >= ABSENSI_PULANG_TIME.start && currentHour <= ABSENSI_PULANG_TIME.end && isAbsensiPulang)}
                        className={`px-4 py-2 text-xs rounded text-white ${
                            ((currentHour >= ABSENSI_MASUK_TIME.start && currentHour <= ABSENSI_MASUK_TIME.end && isAbsensiMasuk) || (currentHour >= ABSENSI_PULANG_TIME.start && currentHour <= ABSENSI_PULANG_TIME.end && isAbsensiPulang))
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-400"
                        }`}
                    >
                        {currentHour >= ABSENSI_MASUK_TIME.start && currentHour <= ABSENSI_MASUK_TIME.end && isAbsensiMasuk ? "Sudah Absen Masuk" :
                         currentHour >= ABSENSI_PULANG_TIME.start && currentHour <= ABSENSI_PULANG_TIME.end && isAbsensiPulang ? "Sudah Absen Pulang" :
                         "Absensi"}
                    </button>
                </div>
                <span className="text-[10px] text-slate-400">{keterangan}</span>
            </div>
        </div>
    );
};

export default CardAbsensi;
