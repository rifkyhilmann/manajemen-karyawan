import { faDollar, faHome, faUser, faFileAlt, faCalendar, faGear, faSignOut } from "@fortawesome/free-solid-svg-icons"
import { MenuSidebar } from "./MenuSidebar"
import Logo from '../../assets/logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/reducers/authReducers"

interface pageProps {
    isActive : boolean;
}

export const SidebarAdmin:React.FC<pageProps> = ({isActive}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/admin/sign-in')
    }

    return (
        <div className={`h-screen fixed w-[250px] bg-white  flex-col ${isActive ? 'fixed sidebar-container' : 'hidden sidebar-active'} z-20 `}>
            <div className="mx-5 my-3 h-14 flex items-center justify-center gap-2">
                <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <img src={Logo} alt="" className="h-8 w-8" />
                </div>
                <p className="text-2xl text-blue-500 font-semibold font-pridi">Akses Digital</p>
            </div>
            <div className="mx-5 my-5 h-max flex flex-col gap-3 text-textLight">
                <p className="text-sm">Menu</p>
                <div className="w-full h-max flex-col gap-2 flex items-center">
                    <MenuSidebar 
                        title="Dashboard"
                        icons={faHome}
                        url="/admin"
                    />
                    <MenuSidebar 
                        title="Karyawan"
                        icons={faUser}
                        url="/admin/data-karyawan"
                    />
                    <MenuSidebar 
                        title="Absensi"
                        icons={faCalendar}
                        url="/admin/data-absensi"
                    />
                    <MenuSidebar 
                        title="Laporan Gaji"
                        icons={faDollar}
                        url="/admin/laporan-gaji"
                    />
                    <MenuSidebar 
                        title="Ajuan Cuti"
                        icons={faFileAlt}
                        url="/admin/ajuan-cuti"
                    />
                </div>
                <p className="text-sm mt-5">Account</p>
                <div className="w-full h-max flex-col gap-2 flex items-center">
                    <MenuSidebar 
                        title="Profile"
                        icons={faUser}
                        url="/admin/karyawan"
                    />
                    <MenuSidebar 
                        title="Settings"
                        icons={faGear}
                        url="/admin/karyawan"
                    />
                    <div 
                        onClick={handleSignOut}
                        className="h-10 w-full rounded flex items-center cursor-pointer hover:bg-blue-500 hover:text-white transition-all">
                        <div className="h-max w-5 mx-3 flex items-center justify-center" >
                             <FontAwesomeIcon icon={faSignOut} className="text-lg" />
                        </div>
                        <p className="text-sm font-normal">Logout</p>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
