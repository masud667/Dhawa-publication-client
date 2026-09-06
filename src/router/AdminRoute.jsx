// src/Routes/AdminRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading, isAdminLoading } = useContext(AuthContext);
    const location = useLocation();

    // 1. Wait until BOTH Firebase user and Admin API checks are finished
    if (loading || isAdminLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // 2. Allow entry only if user exists AND is confirmed admin
    if (user && isAdmin) {
        return children;
    }

    // 3. Kick non-admins back to home
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;