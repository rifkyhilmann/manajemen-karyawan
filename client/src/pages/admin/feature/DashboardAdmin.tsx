import { useEffect, useState } from "react";
import { IconsBill, IconsChat, IconsDocument, IconsUser } from "../../../assets";
import { CardDashboard } from "../../../components/element/CardDashboard";
import { GetData } from "../../../utils/apiUtils";

// Define the shape of the count data
interface CountData {
    karyawan: number;
    cuti: number;
    gaji: number;
    feedback: number;
}

export const DashboardAdmin = () => {
    // Use CountData type and initialize with undefined
    const [count, setCount] = useState<CountData | undefined>(undefined);

    const fetchData = async () => {
        try {
            const response = await GetData('count');
            setCount(response?.data); 
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="mx-10 h-max flex flex-col">
            <div className="flex flex-col">
                <p className="text-lg font-medium">Dashboard</p>
                <p className="text-xs">Home</p>
            </div>
            <div className="my-5 h-max w-full">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 w-full gap-3">
                    {/* Use optional chaining (count?.karyawan) to handle undefined count */}
                    <CardDashboard images={IconsUser} color="bg-customBlue" title="Karyawan" count={count?.karyawan ?? 0} />
                    <CardDashboard images={IconsDocument} color="bg-customGreen" title="Ajuan Cuti" count={count?.cuti ?? 0} />
                    <CardDashboard images={IconsBill} color="bg-customYellow" title="Total Gaji" count={count?.gaji ?? 0} />
                    <CardDashboard images={IconsChat} color="bg-customRed" title="Feedback" count={count?.feedback ?? 0} />
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-10">
                    <Calendar />
                    <Bars /> 
                </div> */}
            </div>
        </div>  
    );
};
