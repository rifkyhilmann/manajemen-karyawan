import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from '@mui/x-data-grid';

interface RowData {
  id: number;
  nip: string;
  name: string;
  alamat: string;
  email: string;
  no_hp: string;
  jabatan: string;
  isNew?: boolean; // Mark as optional if it's not always present
}

const initialRows: RowData[] = [
  { id: 1, nip: 'NIP001', name: 'John Doe', alamat: '123 Main St', email: 'john@example.com', no_hp: '1234567890', jabatan: 'Manager' },
  { id: 2, nip: 'NIP002', name: 'Jane Smith', alamat: '456 Oak St', email: 'jane@example.com', no_hp: '0987654321', jabatan: 'Developer' },
  // Add more rows as needed...
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: RowData[]) => RowData[]) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = initialRows.length + 1; // or use a randomId function if needed
    setRows((oldRows) => [
      ...oldRows,
      { id, nip: '', name: '', alamat: '', email: '', no_hp: '', jabatan: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function TableKaryawan() {
  const [rows, setRows] = React.useState<RowData[]>(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) { // Use optional chaining here
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel): RowData => {
    // Ensure that newRow has the same structure as RowData
    const updatedRow: RowData = {
      id: newRow.id as number, // Cast to number if necessary
      nip: newRow.nip as string,
      name: newRow.name as string,
      alamat: newRow.alamat as string,
      email: newRow.email as string,
      no_hp: newRow.no_hp as string,
      jabatan: newRow.jabatan as string,
      isNew: false, // This property can be optional
    };
  
    // Update the rows state with the updated row
    setRows(rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    
    return updatedRow; // Return the updated row
  };
  

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<RowData>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nip', headerName: 'NIP', flex: 1, editable: true },
    { field: 'name', headerName: 'Name', flex: 2, editable: true },
    { field: 'alamat', headerName: 'Address', flex: 1, editable: true },
    { field: 'email', headerName: 'Email', flex: 2, editable: true },
    { field: 'no_hp', headerName: 'No Hp', flex: 1, editable: true },
    { field: 'jabatan', headerName: 'Jabatan', flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
      />
    </Box>
  );
}
