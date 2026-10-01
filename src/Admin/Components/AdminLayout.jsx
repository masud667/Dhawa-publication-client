// src/Layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import AdminSidebar from '../Components/AdminSidebar'; // আপনার AdminSidebar-এর সঠিক পাথ দিন

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAF9F5] flex">
            {/* ─── Admin Sidebar Component ─── */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* ─── Main Content Area ─── */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Mobile Header with Menu Button */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-amber-200/30 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition focus:outline-none"
                            aria-label="Open Sidebar"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="font-serif text-lg font-bold text-[#174D3B]">
                            Dawah <span className="text-emerald-700">Admin</span>
                        </h1>
                    </div>
                </header>

                {/* Dashboard Pages Output */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;