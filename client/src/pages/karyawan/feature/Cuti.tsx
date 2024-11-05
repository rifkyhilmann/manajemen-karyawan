import { faAdd } from "@fortawesome/free-solid-svg-icons"
import { Paper } from "@mui/material";
import {  DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { GetData, PostData } from "../../../utils/apiUtils";
import ModalsTable from "../../../components/element/ModalTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Form, Formik } from "formik";
import InputFormik from "../../../components/element/InputFormik";
import { showDialog, showToast } from "../../../utils/alertUtils";

interface RowData {
    id : number;
    name : string;
    tanggal_mulai : string;
    tanggal_selesai : string;
    jenis_cuti : string;
    status : string;
    keterangan : string;
}

export const CutiKaryawan = () => {
    const [data, setData] = useState([])
    const email = useSelector((state : RootState) => state.auth.email);
    const karyawan = useSelector((state : RootState) => state.auth.karyawan);

    const fetchData = async() => {
        try {
            const response = await GetData(`cuti/${email}`)
            setData(response?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const AddCuti = async (values : any) =>  {
        try {
            const response = await PostData('cuti', values)
            
            if (response.status === 200) {
                
                fetchData();
                showToast('success', 'Berhasil Mengajukan Cuti')
            }
            
        } catch (error) {
            showDialog('error', 'error add cuti')
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const columns: GridColDef<RowData>[] = [
        { field: 'id', headerName: 'ID', width: 30 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'tanggal_mulai', headerName: 'Tanggal Mulai', flex: 1 },
        { field: 'tanggal_selesai', headerName: 'Tanggal Selesai', flex: 1 },
        { field: 'jenis_cuti', headerName: 'Jenis Cuti', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => {
                // Define a color class based on the status
                let statusClass = '';
                if (params.row.status === 'REJECTED') {
                    statusClass = 'text-red-500 font-semibold'; // Red for rejected
                } else if (params.row.status === 'APPROVED') {
                    statusClass = 'text-green-500 font-semibold'; // Green for approved
                } else if (params.row.status === 'PENDING') {
                    statusClass = 'text-blue-500 font-semibold'; // Blue for pending
                }
    
                return (
                    <span className={statusClass}>
                        {params.row.status}
                    </span>
                );
            }
        },
        { field: 'keterangan', headerName: 'Keterangan', flex: 1 },
    ];

    const validate = (values : any) => {
        const errors: any = {};
        if(!values.tanggal_mulai) {
            errors.tanggal_mulai = "tanggal_mulai required"
        }
        if(!values.tanggal_selesai) {
            errors.tanggal_selesai = "tanggal_selesai required"
        }
        if(!values.jenis_cuti) {
            errors.jenis_cuti = "jenis_cuti required"
        }
        if(!values.keterangan) {
            errors.keterangan = "keterangan required"
        }

        return errors;
    }

    return (
        <div className="mx-10 h-max flex flex-col">
            <div className="flex flex-col">
                <p className="text-lg font-medium">Cuti</p>
                <p className="text-xs">Data Cuti</p>
            </div>
            <div className="my-5 h-max w-full">
                <div className="w-full flex items-center justify-end gap-3 mb-10">
                    <ModalsTable icons={faAdd} title="Ajukan Cuti">
                        <>
                            <p className="font-semibold">Ajukan Cuti</p>
                            <div className="flex flex-col gap-2">
                            <Formik
                                    initialValues={{ id : karyawan?.id || 0, tanggal_mulai: '', tanggal_selesai: '', jenis_cuti: '', keterangan: '' }}
                                    validate={validate}
                                    onSubmit={(values, { resetForm }) => {
                                        const setToMidnight = (dateString : any) => {
                                            const date = new Date(dateString);
                                            date.setHours(0, 0, 0, 0);
                                            return date;
                                        };
                                        const payload = {
                                            karyawanId: values.id, // Make sure you're sending the correct ID
                                            tanggal_mulai: setToMidnight(values.tanggal_mulai),
                                            tanggal_selesai: setToMidnight(values.tanggal_selesai),
                                            jenis_cuti: values.jenis_cuti,
                                            keterangan: values.keterangan
                                        };
                                        console.log(values);
                                        resetForm();
                                        if (payload) {
                                            AddCuti(payload)
                                        }
                                    }}
                                >
                                    {({ errors }) => (
                                        <Form className="flex flex-col gap-2">
                                            <InputFormik title="Id" name="id" type="text" onDisabled={true}/>
                                            <InputFormik title="Tanggal Mulai" name="tanggal_mulai" type="date" />
                                            {errors.tanggal_mulai && <div className="text-red-500 text-[10px]">{errors.tanggal_mulai}</div>}
                                            <InputFormik title="Tanggal Selesai" name="tanggal_selesai" type="date" />
                                            {errors.tanggal_selesai && <div className="text-red-500 text-[10px]">{errors.tanggal_selesai}</div>}
                                            <InputFormik title="Jenis Cuti" name="jenis_cuti" type="text" />
                                            {errors.jenis_cuti && <div className="text-red-500 text-[10px]">{errors.jenis_cuti}</div>}
                                            <InputFormik title="Keterangan" name="keterangan" type="text" />
                                            {errors.keterangan && <div className="text-red-500 text-[10px]">{errors.keterangan}</div>}
                                            <button type="submit" className="w-full h-10 bg-blue-500 rounded my-5 text-white">
                                                Submit
                                            </button>
                                        </Form>
                                    )}
                            </Formik>

                            </div>
                        </>
                    </ModalsTable>
                </div>
                <Paper sx={{ height: 600, width: '100%' }}>
                    <DataGrid 
                        rows={data}
                        columns={columns}
                    />
                </Paper>
            </div>
        </div>
    )
}
