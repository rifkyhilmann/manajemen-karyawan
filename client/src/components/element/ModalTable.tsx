import { useState } from "react"
import Modals from "./Modal"
import { IconDefinition } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface props {
    children : React.ReactElement;
    icons : IconDefinition;
    title? : string;
}

const ModalsTable:React.FC<props> = ({children, icons, title}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <div 
                onClick={openModal}
                className="flex items-center gap-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded">
                <FontAwesomeIcon icon={icons} />
                {title && 
                    <p className="font-medium text-sm font-poppins">{title}</p>
                } 
            </div>
            <Modals isOpen={isOpen} onClose={closeModal}>
                <div className="flex flex-col w-full gap-5">
                    {children}
                </div>
            </Modals>
        </>
    )
}

export default ModalsTable