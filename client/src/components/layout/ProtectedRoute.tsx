import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from "react";
import { isTokenExpired } from "./isTokenExpired";

interface ProtectedRouteProps {
    children: React.ReactElement;
    role: "admin" | "karyawan"; // Define roles as union types for clarity
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const email = useSelector((state: RootState) => state.auth.email);
    const userRole = useSelector((state: RootState) => state.auth.role); // Assume `role` is stored in auth state

    if (!token || !email || isTokenExpired(token)) {
        // Redirect to sign-in if not authenticated
        return <Navigate to={role === "admin" ? "/admin/sign-in" : "/karyawan/sign-in"} replace />;
    }

    if (userRole !== role) {
        // Redirect based on the actual user role if it doesn't match the required role
        return <Navigate to={userRole === "admin" ? "/admin" : "/karyawan"} replace />;
    }

    return children;
};

export default ProtectedRoute;
