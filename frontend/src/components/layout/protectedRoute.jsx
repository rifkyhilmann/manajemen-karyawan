import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = useSelector((state) => state.auth.token);
    const email = useSelector((state) => state.auth.email);
    const role = useSelector((state) => state.auth.role);

    // Arahkan ke sign-in khusus berdasarkan role jika token/email tidak valid
    if (!token || !email) {
        if (role === 'admin') {
            return <Navigate to="/admin/sign-in" replace />;
        } else if (role === 'karyawan') {
            return <Navigate to="/karyawan/sign-in" replace />;
        }
    }

    // Render elemen jika semua validasi lulus
    return element;
};

export default ProtectedRoute;
