import { useEffect, useState } from "react";
import Getdate from "../../../utils/date"
import { GetData } from "../../../utils/apiUtils";
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import CardAbsensi from "../../../components/element/CardAbsensi";

export const DashboardKaryawan = () => {
    const date = Getdate()
    const karyawan = useSelector((state : RootState) => state.auth.karyawan);
    const [rekapAbsensi, setRekapAbsensi] = useState([])
    
    const GetRekapAbsensi = async () => {
        try {
            const response = await GetData(`status-absensi/${karyawan?.id}`)
            setRekapAbsensi(response?.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetRekapAbsensi();
    }, [karyawan])   

    return (
        <div className="mx-10 h-max flex flex-col font-poppins " >
            <div className="flex flex-col">
                <p className="text-lg font-medium">Dashboard</p>
                <p className="text-xs">Home</p>
            </div>
            <div className="my-5 h-max min-h-[265px]  w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className=" h-max flex flex-col rounded-xl border bg-white shadow-md">
                    <div className="h-14 bg-custom-gradient rounded-t-xl px-4 flex flex-col justify-center text-white">
                        <p className="font-medium text-md">Rekap Absensi</p>
                        <p className="text-xs">{date}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-3 py-2 my-2 ">
                        {rekapAbsensi.map((item : any, index : any)=> (
                            <div key={index} className="w-full border-b h-7  px-3 flex items-center justify-between">
                                <p className="text-sm font-medium w-full">{item?.status}</p>
                                <p className="text-xs font-normal w-full">{item?.jumlah} Hari</p>
                            </div>
                        ))}
                    </div>
                </div>
                <CardAbsensi 
                
                />
                <div className=" h-max min-h-[265px] flex flex-col rounded-xl border bg-white shadow-md">
                    <div className="h-14 bg-custom-gradient rounded-t-xl px-4 flex flex-col justify-center text-white">
                        <p className="font-medium text-md">Rekap Gaji</p>
                        <p className="text-xs">{date}</p>
                    </div>
                    <div className="flex items-center justify-center flex-1 ">
                        <p className="text-gray-500 font-medium">Tidak ada Gaji</p>
                    </div>
                </div>
                
            </div>
            <div className="my-5 h-max min-h-[250px] w-full flex flex-col rounded-xl border bg-white">
                <div className="h-14 bg-custom-gradient rounded-t-xl px-4 flex flex-col items-center justify-center text-white">
                    <p className="font-medium text-md">Pengumuman</p>
                </div>
                <div className="flex items-center justify-center flex-1 ">
                    <p className="text-gray-500 font-medium">Belum ada Pengumuman</p>
                </div>
            </div>
        </div>
    )
}
