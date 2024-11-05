import Logo from '../../assets/logo.png'
import { faDollar, faHome, faFile, faCalendar, faSignOut } from "@fortawesome/free-solid-svg-icons"
import { MenuSidebar } from "./MenuSidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/reducers/authReducers"
import { IconsProfile } from '../../assets';
import { RootState } from '../../redux/store';

interface pageProps {
    isActive : boolean;
}

export const SidebarKaryawan:React.FC<pageProps> = ({isActive}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const karyawan = useSelector((state : RootState) => state.auth.karyawan);

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/karyawan/sign-in')
    }

    return (
        <div className={`h-screen fixed w-[250px] bg-white  flex-col ${isActive ? 'fixed sidebar-container' : 'hidden sidebar-active'} z-20 `}>
            <div className="mx-5 my-3 h-14 flex items-center justify-center gap-2">
                <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <img src={Logo} alt="" className="h-8 w-8" />
                </div>
                <p className="text-2xl text-blue-500 font-semibold font-pridi">Akses Digital</p>
            </div>
            <div className='h-max flex flex-col gap-4 w-full items-center justify-center py-1'>
                <img 
                    src={karyawan?.image ? karyawan.image : IconsProfile} 
                    alt="" 
                    className='h-24 w-24 object-cover rounded-full'
                />
                <div className='flex flex-col items-center text-textLight'>
                    <p className='text-sm font-medium '>{karyawan?.name ? karyawan.name : 'Name' }</p>
                    <p className='font-semibold text-gray-700'>{karyawan?.jabatan ? karyawan.jabatan : 'Jabatan'}</p>
                </div>
            </div>
            <div className="mx-5 my-4 h-max flex flex-col gap-3 text-textLight">
                <div className="w-full h-max flex-col gap-2 flex items-center">
                    <MenuSidebar 
                        title='Dashboard'
                        icons={faHome}
                        url='/karyawan'
                    />
                    <MenuSidebar 
                        title='Absensi'
                        icons={faCalendar}
                        url='/karyawan/absensi'
                    />
                    <MenuSidebar 
                        title='Gaji'
                        icons={faDollar}
                        url='/karyawan/gaji'
                    />
                    <MenuSidebar 
                        title='Cuti'
                        icons={faFile}
                        url='/karyawan/cuti'
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
