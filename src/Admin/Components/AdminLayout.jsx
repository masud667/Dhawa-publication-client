import { Outlet } from 'react-router';
// import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    //   const { loading } = useAdminAuth();

    //   if (loading) {
    //     return (
    //       <div className="min-h-screen flex items-center justify-center">
    //         <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
    //       </div>
    //     );
    //   }

    return (
        <div className="flex min-h-screen bg-[#FAF9F5]">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                <AdminHeader />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;