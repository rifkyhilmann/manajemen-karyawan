import { Route, Routes } from "react-router-dom";
import { NavbarAdmin } from "../../components/element/NavbarAdmin";
import { SidebarAdmin } from "../../components/element/SidebarAdmin";
import { DashboardAdmin } from "./feature/DashboardAdmin";
import { useState } from "react";
import { DataKaryawan } from "./feature/DataKaryawan";
import { DataAbsensi } from "./feature/DataAbsensi";
import { LaporanGaji } from "./feature/LaporanGaji";
import { AjuanCuti } from "./feature/AjuanCuti";

export const PagesAdmin = () => {
    const [sidebarIsActive, setSidebarIsActive] = useState(true);
    const toggleSidebar = () => setSidebarIsActive(!sidebarIsActive);

    return (
        <div className="flex  min-h-screen w-full h-max font-poppins overflow-x-hidden">
            <SidebarAdmin 
                isActive={sidebarIsActive}
            />
            <div className={`w-full bg-light min-h-screen ${sidebarIsActive ? 'ml-0 md:ml-[250px]' : 'ml-0'} `}>
                <NavbarAdmin toggleSidebar={toggleSidebar} />
                <Routes>
                    <Route path="/" element={<DashboardAdmin />} />
                    <Route path="/data-karyawan" element={<DataKaryawan />} />
                    <Route path="/data-absensi" element={<DataAbsensi />} />
                    <Route path="/laporan-gaji" element={<LaporanGaji />} />
                    <Route path="/ajuan-cuti" element={<AjuanCuti />} />
                </Routes>
                
            </div>
        </div>

    )
}
