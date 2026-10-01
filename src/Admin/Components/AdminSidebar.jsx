import React from 'react';
import { NavLink } from 'react-router';
import {
    LayoutDashboard,
    BookOpen,
    ShoppingBag,
    LogOut,
    X,
} from 'lucide-react';
import useAdminAuth from '../useAdminAuth';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logoutAdmin: logout } = useAdminAuth();

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
        },
        {
            path: '/admin/books',
            icon: BookOpen,
            label: 'Books',
        },
        {
            path: '/admin/orders',
            icon: ShoppingBag,
            label: 'Orders',
        },
    ];

    return (
        <>
            {/* ─── Mobile Overlay Backdrop ─── */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            {/* ─── Sidebar Body ─── */}
            <aside
                className={`
          fixed left-0 top-0 h-screen w-64 bg-white shadow-xl border-r border-amber-200/30 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Sidebar Header */}
                <div className="p-5 border-b border-amber-200/30 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold text-[#174D3B]">
                        Dawah <span className="text-emerald-700">Admin</span>
                    </h2>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose} // মোবাইলে ক্লিকে মেনু বন্ধ হবে
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 font-bold border-r-4 border-emerald-600'
                                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                                    }`
                                }
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-200/30 bg-white">
                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;