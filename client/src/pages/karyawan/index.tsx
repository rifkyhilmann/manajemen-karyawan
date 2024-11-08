import { useState } from "react";
import { SidebarKaryawan } from "../../components/element/SidebarKaryawan";
import { NavbarAdmin } from "../../components/element/NavbarAdmin";
import { Route, Routes } from "react-router-dom";
import { DashboardKaryawan } from "./feature/DashboardKaryawan";
import { AbensiKaryawan } from "./feature/AbsensiKaryawan";
import { GajiKaryawan } from "./feature/GajiKaryawan";
import { CutiKaryawan } from "./feature/Cuti";
import ProfileKaryawan from "./feature/ProfileKaryawan";

export const PagesKaryawan = () => {
    const [sidebarIsActive, setSidebarIsActive] = useState(true);
    const toggleSidebar = () => setSidebarIsActive(!sidebarIsActive);

    return (
        <div className="flex  min-h-screen w-full h-max font-poppins overflow-x-hidden">
           <SidebarKaryawan
                isActive={sidebarIsActive}
            />
            <div className={` w-full bg-light min-h-screen ${sidebarIsActive ? 'ml-0 md:ml-[250px]' : 'ml-0'} `}>
                <NavbarAdmin toggleSidebar={toggleSidebar} />
                <Routes>
                    <Route path="/" element={<DashboardKaryawan />} />
                    <Route path="/absensi" element={<AbensiKaryawan/>} />
                    <Route path="/gaji" element={<GajiKaryawan/>} />
                    <Route path="/cuti" element={<CutiKaryawan />} />
                    <Route path="/profile" element={<ProfileKaryawan />} />
                </Routes>
            </div>
        </div>

    )
}
