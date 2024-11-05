export interface AuthState {
    token: string | null;
    email: string | null;
    role?: string | null; 
    karyawan?: Karyawan | null; // Include karyawan data
    admin?: Admin | null;
}

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

export const LOGIN_SUCCESS = 'auth/loginSuccess'; // Tambahkan namespace
export const LOGOUT = 'auth/logout';

interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
    payload: {
        token: string;
        email: string;
        role?: string; 
        karyawan?: Karyawan | null; // Include karyawan data
        admin?: Admin | null;
    };
}

interface LogoutAction {
    type: typeof LOGOUT;
}

export type AuthActionTypes = LoginSuccessAction | LogoutAction;
