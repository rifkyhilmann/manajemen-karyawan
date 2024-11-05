import {  faAdd, faPen, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { faEye } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useState } from 'react';
import { DeleteData, GetData, PostData, UpdateData } from "../../../utils/apiUtils";
import { ButtonTable } from "../../../components/element/ButtonTable";
import ModalsTable from "../../../components/element/ModalTable";
import { Formik, Form } from 'formik';
import InputFormik  from "../../../components/element/InputFormik";
import { OptionJabatan } from "../../../components/element/OptionJabatan";
import { showConfirmDialog, showDialog, showToast } from "../../../utils/alertUtils";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';

interface RowData {
    id: number;
    nip: string;           // Added NIP field
    name: string;
    alamat: string;       // Added Address field
    email: string;        // Added Email field
    no_hp: string;        // Added No Hp field
    jabatan: string;      // Added Jabatan field
}

export const DataKaryawan: React.FC = () => {
    const [selectedRow, setSelectedRow] = useState(false);
    const [selectId, setSelectId] = useState<string | null>(null);
    const [dataKaryawan, setDataKaryawan] = useState([])
    const [initialValues, setInitialValues] = useState({ nip: '', name: '', password: '', alamat: '', email: '', no_hp: '', jabatanId: '' });    
    const [loading, setLoading] = useState(false);
    const doc = new jsPDF('landscape');

    const fetchDataKaryawan = async () => {
        setLoading(true);
        try {
            const response = await GetData('karyawan');
            setDataKaryawan(response?.data || []);
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }

    const fetchDataById = async () => {
        if (!selectId) return;
        setLoading(true);
        try {
            const response = await GetData(`karyawan/${selectId}`);
            setInitialValues(response?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(selectId) {
            fetchDataById();
            setSelectedRow(true); 
        }
    }, [selectId])

    useEffect(() => {
        fetchDataKaryawan();
    }, [])

    const columns: GridColDef<RowData>[] = [
        { field: 'id', headerName: 'ID', width: 30 },
        { field: 'nip', headerName: 'NIP', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'alamat', headerName: 'Address', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'no_hp', headerName: 'No Hp', flex: 1 },
        {
            field: 'jabatan',
            headerName: 'Jabatan',
            flex: 1,
            renderCell: (params) => (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-green-500 h-7 flex items-center justify-center rounded-full text-white w-[90%]  text-[8px] font-poppins">
                        {params.row.jabatan ? params.row.jabatan : 'Tidak Ada'}
                    </div>
                </div>
            ),
        },
    ];

    const handleRowClick = (params: any) => {
        setSelectId(params.row.id);
    };

    const fetchAddData = async (values : any) => {
        try {
            if (values) {
                const data = values
                const response = await PostData('karyawan', data)

                if(response?.status === 200) {
                    fetchDataKaryawan()
                    showToast('success', "Berhasil menambahkan data karyawan");
                }
            }
        } catch (error) {
            console.log(error)
            showDialog('error', 'error menambahkan data')
        }
    }

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.nip) {
            errors.nip = 'NIP is required';
        }
        if (!values.name) {
            errors.name = 'Name is required';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        }
        if (!values.alamat) {
            errors.alamat = 'Address is required';
        }
        if (!values.email) {
            errors.email = 'Email is required';
        }
        if (!values.no_hp) {
            errors.no_hp = 'No Handphone is required';
        }
        if (!values.jabatanId) {
            errors.jabatanId = 'Jabatan is required';
        }
        return errors;
    };

    const handleDelete = async () => {
        if (selectId) {
            const confirm = await showConfirmDialog('Apakah Anda yakin ingin menghapus item ini?', 'Setelah dihapus, data tidak dapat dipulihkan.');

            if(confirm) {
                const fetchDelete = async () => {
                    try {
                        const response = await DeleteData('karyawan', selectId);

                        if (response?.status === 200) {
                            fetchDataKaryawan()
                            showToast('success', 'Berhasil menghapus')
                        }
                    } catch (error) {
                        showDialog('error', 'Gagal Menghapus data')
                    }
                }

                fetchDelete();
            } else {
                showToast('info', 'Penghapusan dibatalkan.');
            }
        }
    }
    const navigate = useNavigate()

    const fetchUpdateData = async (values : any) => {
        try {
            if (selectId) {
                const response = await UpdateData('karyawan', selectId, values);

                if (response?.status === 200) {
                    fetchDataKaryawan()
                    showToast('success', "Berhasil update data karyawan");
                    navigate('/admin/data-karyawan')
                }
            }
        } catch (error) {
            console.log(error)
            showDialog('error', 'error menambahkan data')
        }
    }

    const handlePrint = () => {
        const body = dataKaryawan.map((row: RowData) => [
            row.id,
            row.nip,
            row.name,
            row.alamat,
            row.email,
            row.no_hp,
            row.jabatan
        ]);

        autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } }, 
            theme : 'grid',
            head : [['ID', 'NIP', 'Nama', 'Alamat', 'Email', 'No HP', 'Jabatan']],
            body : body,
            styles: {
                font: 'Helvetica', // Jenis font
                fontSize: 10, // Ukuran font
                cellPadding: 2, // Padding sel
                overflow: 'linebreak', // Mengatur overflow
            },
            headStyles: {
                fillColor: [22, 160, 133], // Warna latar belakang header
                textColor: [255, 255, 255], // Warna teks header
                halign: 'center', // Penyelarasan horizontal
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245], // Warna latar belakang baris alternatif
            },
            margin: { top: 10 },
        })

        doc.save('DataKaryawan.pdf')
    }

    const handleExport = () => {
        const body = dataKaryawan.map((row: RowData) => ({
            ID: row.id,
            NIP: row.nip,
            Nama: row.name,
            Alamat: row.alamat,
            Email: row.email,
            'No HP': row.no_hp,
            Jabatan: row.jabatan,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(body);
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Karyawan');
    
        XLSX.writeFile(workbook, 'DataKaryawan.xlsx');
    }
    

    return (
        <div className="mx-10 h-max flex flex-col font-poppins  ">
            <div className="flex flex-col">
                <p className="text-lg font-medium">Karyawan</p>
                <p className="text-xs">Data Karyawan</p>
            </div>
            <div className="my-5 w-full flex flex-col h-[700px]">
                <div className="w-full flex  items-center justify-between gap-2 mb-10">
                    <div className="flex items-center gap-3">
                        {selectedRow && (
                            <>
                                {/* Update Data Karyawan */}
                                <ModalsTable icons={faPen}>
                                    <>
                                        <p className="font-semibold">Update Karyawan</p>
                                        <div className="flex flex-col gap-2">
                                            <Formik
                                                    initialValues={initialValues}
                                                    validate={validate}
                                                    enableReinitialize={true}
                                                    onSubmit={(values, { resetForm }) => {
                                                        resetForm();
                                                        setSelectId(null)
                                                        console.log(values)
                                                        fetchUpdateData(values)
                                                    }}
                                                >
                                                    {({ errors }) => (
                                                        <Form className="flex flex-col gap-2">
                                                            <InputFormik title="Nip" name="nip" type="text" />
                                                            {errors.nip && <div className="text-red-500 text-[10px]">{errors.nip}</div>}
                                                            <InputFormik title="Name" name="name" type="text" />
                                                            {errors.name && <div className="text-red-500 text-[10px]">{errors.name}</div>}
                                                            <InputFormik title="Address" name="alamat" type="text" />
                                                            {errors.alamat && <div className="text-red-500 text-[10px]">{errors.alamat}</div>}
                                                            <InputFormik title="Email" name="email" type="email" />
                                                            {errors.email && <div className="text-red-500 text-[10px]">{errors.email}</div>}
                                                            <InputFormik title="No Handphone" name="no_hp" type="text" />
                                                            {errors.no_hp && <div className="text-red-500 text-[10px]">{errors.no_hp}</div>}
                                                            <OptionJabatan />
                                                            {errors.jabatanId && <div className="text-red-500 text-[10px]">{errors.jabatanId}</div>}
                                                            <button type="submit" className="w-full h-10 bg-blue-500 rounded my-5 text-white">
                                                                Update
                                                            </button>
                                                        </Form>
                                                    )}
                                            </Formik>
                                        </div>
                                    </>
                                </ModalsTable>  
                                {/* Update Data Karyawan */}
                                
                                {/* Button Delete Data */}
                                <ButtonTable 
                                    icons={faTrash}
                                    onClick={handleDelete}
                                />
                                {/* Button Delete Data */}
                                
                                {/* Modals Detail Karyawan */}
                                <ModalsTable icons={faEye} >
                                    <>
                                        <p className="font-semibold">Detail Karyawan</p>
                                        <div className="flex flex-col gap-2">
                                            <Formik
                                                    initialValues={initialValues}
                                                    enableReinitialize={true}
                                                    onSubmit={() => {}}
                                                >
                                                    {() => (
                                                        <Form className="flex flex-col gap-2">
                                                            <InputFormik title="Nip" name="nip" type="text" onDisabled={true} />
                                                            <InputFormik title="Name" name="name" type="text"  onDisabled={true}/>
                                                            <InputFormik title="Address" name="alamat" type="text" onDisabled={true} />
                                                            <InputFormik title="Email" name="email" type="email" onDisabled={true} />
                                                            <InputFormik title="No Handphone" name="no_hp" type="text" onDisabled={true} />
                                                            <OptionJabatan onDisabled={true} />
                                                        </Form>
                                                    )}
                                            </Formik>
                                        </div>
                                    </>
                                </ModalsTable>
                                
                            </>
                        )}

                        {/* Modals Add Karyawan */}
                        <ModalsTable icons={faAdd}>
                            <>
                                <p className="font-semibold">Tambah Karyawan</p>
                                <div className="flex flex-col gap-2">
                                <Formik
                                    initialValues={{ nip: '', name: '', password : '', alamat : '', email : '', no_hp : '', jabatanId : '' }}
                                    validate={validate}
                                    onSubmit={(values, { resetForm }) => {
                                        fetchAddData(values)
                                        resetForm(); // Mengatur ulang nilai input setelah submit
                                    }}
                                >
                                    {({errors}) => (
                                        <Form className="flex flex-col gap-2">
                                            <InputFormik title="Nip" name="nip" type="text" />
                                            {errors.nip && <div className="text-red-500 text-[10px]">{errors.nip}</div>}
                                            <InputFormik title="Name" name="name" type="text" />
                                            {errors.name && <div className="text-red-500 text-[10px]">{errors.name}</div>}
                                            <InputFormik title="Password" name="password" type="text" />
                                            {errors.name && <div className="text-red-500 text-[10px]">{errors.password}</div>}
                                            <InputFormik title="Address" name="alamat" type="text" />
                                            {errors.alamat && <div className="text-red-500 text-[10px]">{errors.alamat}</div>}
                                            <InputFormik title="Email" name="email" type="email" />
                                            {errors.email && <div className="text-red-500 text-[10px]">{errors.email}</div>}
                                            <InputFormik title="No Handphone" name="no_hp" type="text" />
                                            {errors.no_hp && <div className="text-red-500 text-[10px]">{errors.no_hp}</div>}
                                            <OptionJabatan />
                                            {errors.jabatanId && <div className="text-red-500 text-[10px]" >{errors.jabatanId}</div>}
                                            <button type="submit" className="w-full h-10 bg-blue-500 rounded my-5 text-white">
                                                Submit
                                            </button>
                                        </Form>
                                    )}
                                </Formik>

                                </div>
                            </>
                        </ModalsTable>
                        {/* Modals Add Karyawan */}

                        
                    </div>
                    <div className="flex items-center gap-3">
                        <ButtonTable 
                            icons={faPrint}
                            onClick={handlePrint}
                        />
                        <button 
                            onClick={handleExport}
                            className="h-8 px-4 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white">
                            Export 
                        </button>
                    </div>
                </div>
                <Paper sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={dataKaryawan}
                        columns={columns}
                        sx={{ border: 0 }}
                        onRowClick={handleRowClick}
                        loading={loading}
                        
                    />
                </Paper>
            </div>

        </div>
    );
};
