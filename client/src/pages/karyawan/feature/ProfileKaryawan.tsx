import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { IconsProfile } from "../../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import InputFormik from "../../../components/element/InputFormik";
import { Formik, Form } from "formik";
import axios from "axios";
import { showToast } from "../../../utils/alertUtils";
import { loginSuccess } from "../../../redux/reducers/authReducers";

const ProfileKaryawan = () => {
  const Karyawan = useSelector((state: RootState) => state.auth.karyawan);
  const { token, email } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch()

  // State untuk menyimpan gambar
  const [image, setImage] = useState<File | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Menyimpan gambar yang sebelumnya
  const [previousImage, setPreviousImage] = useState<string | null>(Karyawan?.image || null);

  // Handle perubahan gambar
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file); // Simpan file gambar yang dipilih
      setImageChanged(true); // Tandai bahwa gambar telah berubah
    }
  };

  // Inisialisasi nilai awal dari Redux store (data Karyawan)
  const initialValues = {
    nip: Karyawan?.nip || '',
    name: Karyawan?.name || '',
    alamat: Karyawan?.alamat || '',
    no_hp: Karyawan?.no_hp || '',
    email: Karyawan?.email || '',
    jabatan: Karyawan?.jabatan || ''
  };

    useEffect(() => {
        // Update gambar sebelumnya jika ada perubahan
        setPreviousImage(Karyawan?.image || null);
    }, [Karyawan?.image]);

    const handleSubmit = async (values: any) => {
        const formData = new FormData();
        formData.append("nip", values.nip);
        formData.append("name", values.name);
        formData.append("alamat", values.alamat);
        formData.append("no_hp", values.no_hp);
        formData.append("email", values.email);
        formData.append("jabatan", values.jabatan);

        // Kirim gambar baru hanya jika ada perubahan
        if (image && imageChanged) {
            formData.append("image", image); // Kirim file gambar sebagai bagian dari FormData
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/karyawan/${Karyawan?.id}`, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status === 200) {
                showToast('success', 'Success update data')
                dispatch(loginSuccess({
                    token: token || '',
                    email: email || '',
                    role: "karyawan",
                    karyawan: response.data,  
                }));
            } 
        } catch (error) {
            console.error("Error uploading data", error);
        }
    } ;

    return (
    <div className="mx-10 h-max flex flex-col font-poppins">
        <div className="flex flex-col">
            <p className="text-lg font-medium">Profile</p>
            <p className="text-xs">Profile</p>
        </div>
        <div className="my-5 w-full h-24 bg-white rounded shadow-lg px-8 flex items-center gap-5">
            <div className="flex items-center justify-center relative">
            <img
                src={image ? URL.createObjectURL(image) : previousImage || IconsProfile} // Gunakan gambar baru atau gambar sebelumnya
                alt="profile karyawan"
                className="h-16 w-16 rounded-full object-cover"
            />
            <div className="h-7 w-7 rounded-full bg-custom-gradient absolute right-0 bottom-0 flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon icon={faPen} className="text-white text-xs" />
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
            </div>
            <div className="flex flex-col">
            <p className="font-medium text-lg text-gray-400">{Karyawan?.name ? Karyawan.name : ''}</p>
            <p className="font-medium text-sm">{Karyawan?.jabatan ? Karyawan.jabatan : ''}</p>
            </div>
        </div>
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {() => (
            <Form className="w-full h-max min-h-24 bg-white rounded shadow-lg p-8 flex flex-col items-center gap-5 mb-5">
                <div className="w-full h-max min-h-12 gap-2 grid md:grid-cols-2 grid-cols-1">
                <InputFormik 
                    title="NIP"
                    type="text"
                    name="nip"
                    onDisabled={true}
                />
                <InputFormik 
                    title="Name"
                    type="text"
                    name="name"
                />
                </div>
                <div className="w-full h-max min-h-12 gap-2 grid md:grid-cols-2 grid-cols-1">
                <InputFormik 
                    title="Alamat"
                    type="text"
                    name="alamat"
                />
                <InputFormik 
                    title="Phone Number"
                    type="text"
                    name="no_hp"
                />
                </div>
                <div className="w-full h-max min-h-12 gap-2 grid md:grid-cols-2 grid-cols-1">
                <InputFormik 
                    title="Email"
                    type="email"
                    name="email"
                    onDisabled={true}
                />
                <InputFormik 
                    title="Jabatan"
                    type="text"
                    name="jabatan"
                    onDisabled={true}
                />
                </div>
                <button 
                type="submit" 
                className="mt-5 bg-blue-500 text-white px-4 py-2 w-[200px] rounded"
                >
                Save
                </button>
            </Form>
            )}
        </Formik>
        </div>
    );
};

export default ProfileKaryawan;
