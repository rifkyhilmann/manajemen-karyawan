import { faBell, faMessage, faUser } from "@fortawesome/free-regular-svg-icons"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface navProps {
    toggleSidebar : () => void;
}

export const NavbarAdmin:React.FC<navProps> = ({toggleSidebar}) => {
    return (
        <div className="mx-5 md:mx-10 h-10  my-5 flex items-center justify-between ">
            <FontAwesomeIcon onClick={toggleSidebar} icon={faBars} className="text-lg cursor-pointer transform transition-transform duration-200 hover:scale-110" />
            <div className="flex items-center justify-end gap-3">
                <div className="h-8 w-8 cursor-pointer bg-white rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <div className="h-8 w-8 cursor-pointer bg-white rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faMessage} />
                </div>
                <div className="h-8 w-8 cursor-pointer bg-white rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
        </div>
    )
}
