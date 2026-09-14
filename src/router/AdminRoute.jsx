import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import AuthSecureAxios from '../Hook/AuthSecureAxios';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user?.email) {
                try {
                    const res = await AuthSecureAxios.get(`/users/admin/${user.email}`);
                    setIsAdmin(res.data?.admin === true);
                } catch (err) {
                    console.error("Failed to verify admin:", err);
                    setIsAdmin(false);
                } finally {
                    setIsAdminLoading(false);
                }
            } else {
                setIsAdminLoading(false);
            }
        };

        if (!loading) {
            checkAdminStatus();
        }
    }, [user, loading]);

    if (loading || isAdminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // If user exists and is an admin, allow access
    if (user && isAdmin) {
        return children;
    }

    // If user is NOT an admin, redirect them back to home
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;