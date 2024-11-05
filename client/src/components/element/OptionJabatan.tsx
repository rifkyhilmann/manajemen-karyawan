import { useEffect, useState } from "react";
import { GetData } from "../../utils/apiUtils";
import { Field } from "formik";

interface Jabatan {
    id: string; // atau number, tergantung pada tipe ID yang Anda gunakan
    nama_jabatan: string;
}

interface OptionJabatanProps {
    onDisabled?: boolean; // Tambahkan properti ini
}

export const OptionJabatan: React.FC<OptionJabatanProps> = ({ onDisabled }) => {
    const [data, setData] = useState<Jabatan[]>([]);

    const fetchData = async () => {
        try {
            const response = await GetData('jabatan');
            setData(response?.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Jabatan</span>
            <Field
                name="jabatanId"
                as="select"
                disabled={onDisabled} // Menetapkan disabled berdasarkan prop
                className="w-full h-10 border border-gray-300 rounded focus:outline-none text-sm indent-3"
            >
                <option value="" label="Pilih posisi" />
                {data && data.map((items) => (
                    <option key={items.id} value={items.id} label={items.nama_jabatan} />
                ))}
            </Field>
        </div>
    );
};
