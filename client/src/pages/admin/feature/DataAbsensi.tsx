import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetData } from "../../../utils/apiUtils";
import { useEffect, useState } from "react";
import { ButtonTable } from "../../../components/element/ButtonTable";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';

interface RowData {
    id : number;
    name : string;
    tanggal : string;
    jam_masuk : string;
    jam_keluar : string;
    keterangan : string;
    status : string;    
}

export const DataAbsensi = () => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const doc = new jsPDF('landscape');

    const columns:GridColDef<RowData>[] = [
        { field: 'id', headerName: 'ID', width: 30 },
        { field: 'name', headerName: 'name', flex : 1 },
        { field: 'tanggal', headerName: 'Tanggal', flex : 1 },
        { field: 'jam_masuk', headerName: 'Jam Masuk', flex : 1 },
        { field: 'jam_keluar', headerName: 'Jam Keluar', flex : 1 },
        { field: 'keterangan', headerName: 'Keterangan', flex : 1 },
        { field: 'status', headerName: 'status', flex : 1 },
    ]

    const fetchdata = async() => {
        try {
            const response = await GetData('absensi')
            setData(response?.data.data)
        } catch (error) {
           console.log(error) 
        }
    }

    useEffect(() => {
        fetchdata();
    }, [])

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            if(data) {
                setIsLoading(false)
            }
        }, 1000)
    }, [data])

    const handlePrint = () => {
        const body = data.map((row: RowData) => [
            row.id,
            row.name,
            row.tanggal,
            row.jam_masuk,
            row.jam_keluar,
            row.keterangan,
            row.status
        ]);

        autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } }, 
            theme : 'grid',
            head : [['ID', 'Nama', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Keterangan', 'Status']],
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

        doc.save('DataAbsensi.pdf')
    }
    const handleExport = () => {
        const body = data.map((row: RowData) => ({
            ID: row.id,
            ma: row.name,
            tanggal: row.tanggal,
            jam_masuk: row.jam_masuk,
            jam_keluar: row.jam_keluar,
            keterangan: row.keterangan,
            status: row.status
        }))

        const worksheet = XLSX.utils.json_to_sheet(body);
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Absensi');
    
        XLSX.writeFile(workbook, 'DataAbsensi.xlsx');
    }
    

    return (
        <div className="mx-10 h-max flex flex-col font-poppins">
            <div className="flex flex-col">
                <p className="text-lg font-medium">Abensi</p>
                <p className="text-xs">Data Absensi</p>
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
                        loading={isLoading}
                    />
                </Paper>
            </div>
        </div>
    )
}
