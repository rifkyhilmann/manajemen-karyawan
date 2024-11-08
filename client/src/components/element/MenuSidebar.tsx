import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"; // Import IconDefinition
import { Link, useLocation } from "react-router-dom";

interface PageProps {
    icons: IconDefinition; // Ubah tipe menjadi IconDefinition
    title: string;
    url : string;
}

export const MenuSidebar: React.FC<PageProps> = ({ icons, title, url }) => {
    const location = useLocation();

    return (
        <Link to={url} className={`${location.pathname === url ? 'bg-custom-gradient text-white' : 'bg-transparent'}
            h-10 w-full rounded flex items-center cursor-pointer hover:bg-custom-gradient hover:text-white transition-all`}>
            <div className="h-max w-5 mx-3 flex items-center justify-center">
                <FontAwesomeIcon icon={icons} className="text-lg " />

            </div>
            <p className="text-sm font-normal">{title}</p>
        </Link>
    );
};
