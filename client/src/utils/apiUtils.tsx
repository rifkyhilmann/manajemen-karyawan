import axios from "axios"
import { showDialog } from "./alertUtils";

const BASE_URL = import.meta.env.VITE_BASE_URL

export const FetchSign = async (api : any, data : any) => {
    try {
        const response = await axios.post(`${BASE_URL}/${api}`, data, {
            headers : {
                'Content-Type': 'application/json'
            }
        })
        return response;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            if (error.response) {
                const statusCode = error.response.status;
                if (statusCode === 400) {
                    showDialog('error', 'error', 'email and password incorrect')
                } else if (statusCode === 403) {
                    showDialog('error', 'error', 'email dan password required')
                } else {
                    showDialog('error', 'error', 'server error')
                }
            } else {
                console.error('Network error or no response from server:', error.message);
            }
        } else {
            console.error('An unexpected error occurred:', error);
        }
    }
}

export const GetData = async (api : any) => {
    try {
        const response = await axios.get(`${BASE_URL}/${api}`)

        return response
    } catch (error) {
        console.log(error)
        throw error; 
    }
}

export const PostData = async (api : any, data : any) => {
    try {
        const response = await axios.post(`${BASE_URL}/${api}`, data);

        return response
    } catch (error) {
        console.log(error)      
        throw error; 
    }
}

export const DeleteData = async (api : any, id : any) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${api}/${id}`, );

        return response
    } catch (error) {
        console.log(error)
        alert("Gagal Fetching data karyawan")        
    }
}

export const UpdateData = async (api : any, id : any, data : any) => {
    try {
        const response = await axios.put(`${BASE_URL}/${api}/${id}`, data);

        return response
    } catch (error) {
        console.log(error)
        alert("Gagal Fetching data karyawan")        
    }
}

