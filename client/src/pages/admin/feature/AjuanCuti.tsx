import { Paper } from "@mui/material";
import {  DataGrid, GridColDef } from "@mui/x-data-grid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPrint, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ButtonTable } from "../../../components/element/ButtonTable";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { useEffect, useState } from "react";
import { GetData, PostData } from "../../../utils/apiUtils";
import { showToast } from "../../../utils/alertUtils";

interface RowData {
    id : number;
    name : string;
    tanggal_mulai : string;
    tanggal_selesai : string;
    jenis_cuti : string;
    status : string;
    keterangan : string;
}

export const AjuanCuti = () => {
    const [data, setData] = useState([])
    const doc = new jsPDF('landscape');

    const fetchData = async () => {
        try {
            const response = await GetData('cuti')

            setData(response?.data);
        } catch (error) {
            console.log(error)
        }
    }

    const rejectData = async (id : number) => {
        try {
            const idCuti = id
            const response = await PostData(`cuti/rejected/${id}`, idCuti)
            
            if(response?.status === 200){
                showToast('success', 'berhasil rejected cuti')
                fetchData()
            }
            console.log(response)
        } catch (error : any) {
            if (error?.response) {
                const statusCode = error.response.status;
                
                if (statusCode === 302) {
                    showToast('error', 'Cuti sudah rejected');
                } else if (statusCode === 301) {
                    showToast('error', 'Cuti sudah Approve');
                } else {
                    showToast('error', 'Terjadi kesalahan, coba lagi');
                }
            } else {
                // Handle other types of errors (e.g., network errors)
                console.log('Network or other error:', error);
                showToast('error', 'Terjadi kesalahan, coba lagi');
            }
        }
    }

    const approveData = async (id : number) => {
        try {
            const idCuti = id
            const response = await PostData(`cuti/approve/${id}`, idCuti)
            
            if(response?.status === 200){
                showToast('success', 'berhasil Aprovved cuti')
                fetchData()
            }
            console.log(response)
        } catch (error : any) {
            if (error?.response) {
                const statusCode = error.response.status;
                
                if (statusCode === 302) {
                    showToast('error', 'Cuti sudah rejected');
                } else if (statusCode === 301) {
                    showToast('error', 'Cuti sudah Approve');
                } else {
                    showToast('error', 'Terjadi kesalahan, coba lagi');
                }
            } else {
                // Handle other types of errors (e.g., network errors)
                console.log('Network or other error:', error);
                showToast('error', 'Terjadi kesalahan, coba lagi');
            }
        }
    }

    useEffect(() => {
        fetchData()
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
        {
            field: 'aksi',
            headerName: 'Aksi',
            width: 100,
            renderCell: (params) => (
                <div className="flex h-full w-full items-center justify-center gap-2">
                    <button
                        className="h-7 w-7 bg-green-500 text-white rounded-full flex items-center justify-center"
                        onClick={() => handleApprove(params.row.id)}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                    <button
                        className="h-7 w-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                        onClick={() => handleRejected(params.row.id)}
                    >
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                </div>
            )
        }
    ];

    const handleApprove = (id: number) => {
        if (id) {
            approveData(id);
        }
    };
    
    const handleRejected = (id: number) => {
        if(id) {
            rejectData(id)
        }

    };

    const handlePrint = () => {
        const body = data.map((row: RowData) => [
            row.id,
            row.name,
            row.tanggal_mulai,
            row.tanggal_selesai,
            row.jenis_cuti,
            row.status,
            row.keterangan
        ]);

        autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } }, 
            theme : 'grid',
            head : [['ID', 'Nama', 'Tanggal Mulai', 'Tanggal Selesai', 'Jenis Cuti', 'Status', 'Keterangan']],
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

        doc.save('DataAjuanCuti.pdf')
    }

    const handleExport = () => {
        const body = data.map((row: RowData) => ({
            ID: row.id,
            name: row.name,
            tanggal_mulai: row.tanggal_mulai,
            tanggal_selesai: row.tanggal_selesai,
            jenis_cuti: row.jenis_cuti,
            status: row.status,
            keterangan: row.keterangan
        }));

        const worksheet = XLSX.utils.json_to_sheet(body);
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Ajuan Cuti');
    
        XLSX.writeFile(workbook, 'DataCuti.xlsx');
    }
    

    return (
        <div className="mx-10 h-max flex flex-col font-poppins">
            <div className="flex flex-col">
                <p className="text-lg font-medium">Ajuan Cuti</p>
                <p className="text-xs">Data Ajuan Cuti</p>
            </div>
            <div className="my-5 w-full flex flex-col">
                <div className="w-full flex items-center justify-end gap-3 mb-10">
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
