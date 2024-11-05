import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface InputProps {
    title: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    icon: IconDefinition; // Menggunakan IconDefinition
}

const InputField: React.FC<InputProps> = ({ icon, value, onChange, title }) => { // Ubah icons menjadi icon
    return (
        <div className="w-full flex items-center h-12 border rounded-lg ">
            <FontAwesomeIcon 
                icon={icon}  
                className="text-blue-600 mx-3"
            />
            <input 
                type="text" 
                className="flex-1 flex h-full focus:outline-none font-poppins text-sm"
                placeholder={title}
                value={value}
                onChange={onChange}
                name={title}
            />
        </div>
    );
};

export default InputField;
