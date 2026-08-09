import { useState } from 'react';
import { Outlet } from 'react-router';

import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAF9F5]">

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="min-h-screen lg:ml-64">

                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;