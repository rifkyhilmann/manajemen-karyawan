import Getdate from "../../utils/date"


const CardDashboardKaryawan = () => {
    const date = Getdate()

    return (
        <div className=" h-max flex flex-col rounded-xl border bg-white">
            <div className="h-16 bg-custom-gradient rounded-t-xl px-4 flex flex-col justify-center text-white">
                <p className="font-medium text-md">Rekap Presensi</p>
                <p className="text-xs">{date}</p>
            </div>
            <div className="flex flex-col items-center px-3 pb-8 py-2">
                <div className="w-full border-b h-12 px-3 flex items-center justify-between">
                    <p className="text-md font-medium w-full">Hadir</p>
                    <p className="text-sm font-normal w-full">0 Hari</p>
                </div>
                <div className="w-full border-b h-12 px-3 flex items-center justify-between">
                    <p className="text-md font-medium w-full">Izin</p>
                    <p className="text-sm font-normal w-full">0 Hari</p>
                </div>
                <div className="w-full border-b h-12 px-3 flex items-center justify-between">
                    <p className="text-md font-medium w-full">Cuti</p>
                    <p className="text-sm font-normal w-full">0 Hari</p>
                </div>
            </div>
        </div>
    )
}

export default CardDashboardKaryawan
