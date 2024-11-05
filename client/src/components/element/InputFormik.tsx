import { Field } from "formik";

interface Props {
    title: string;
    name: string;
    type: string;
    onDisabled?: boolean
}

const InputFormik: React.FC<Props> = ({ title, name, type, onDisabled }) => {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{title}</span>
            <Field 
                name={name}
                type={type === "date" ? "date" : type} // Pastikan tipe adalah date jika type diberikan
                className="w-full h-10 rounded indent-3 focus:outline-none border text-sm"
                disabled={onDisabled}
                min={type === "date" ? today : undefined}
            />
    
        </div>
    );
};

// Pastikan Anda mengekspor komponen ini dengan benar
export default InputFormik;
