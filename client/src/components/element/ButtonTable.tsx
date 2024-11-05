import { IconDefinition } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface props {
    icons : IconDefinition
    onClick : () => void
}

export const ButtonTable:React.FC<props> = ({icons, onClick}) => {
    return (
        <div 
            onClick={onClick}
            className="flex items-center gap-3 px-2 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded">
            <FontAwesomeIcon icon={icons} />
        </div>
    )
}
