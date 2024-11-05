import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Karyawan {
    id: string;
    nip: string;
    name: string;
    alamat: string;
    no_hp: string;
    email: string;
    jabatan: string;
    image: string | null;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    no_hp : string;
    image : string | null;
}

interface AuthState {
    token: string | null;
    email: string | null;
    role?: string | null; 
    karyawan?: Karyawan | null; // Karyawan data
    admin?: Admin | null; // Admin data
}

const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null,
    karyawan: JSON.parse(localStorage.getItem('karyawan') || 'null'), // Initialize karyawan from localStorage
    admin: JSON.parse(localStorage.getItem('admin') || 'null'),
};



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ token: string; email: string; role?: string; karyawan? : Karyawan; admin? : Admin }>) {
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('email', action.payload.email);
            localStorage.setItem('role', action.payload.role || '');

            if (action.payload.role === 'karyawan') {
                localStorage.setItem('karyawan', JSON.stringify(action.payload.karyawan || null));
                state.karyawan = action.payload.karyawan || null;
                state.admin = null; // Clear admin data if role is karyawan
            } else if (action.payload.role === 'admin') {
                localStorage.setItem('admin', JSON.stringify(action.payload.admin || null));
                state.admin = action.payload.admin || null;
                state.karyawan = null; // Clear karyawan data if role is admin
            }

            state.token = action.payload.token;
            state.email = action.payload.email;
            state.role = action.payload.role || null;
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('karyawan'); // Remove karyawan from localStorage
            localStorage.removeItem('admin');

            state.token = null;
            state.email = null;
            state.role = null;
            state.karyawan = null; // Clear karyawan data on logout
            state.admin = null;
        },
    },
});

// Ekspor action dan reducer
export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
