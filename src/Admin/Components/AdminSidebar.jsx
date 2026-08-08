import { NavLink } from 'react-router';
import {
    LayoutDashboard,
    BookOpen,
    Tag,
    ShoppingBag,
    MessageSquare,
    LogOut
} from 'lucide-react';

const AdminSidebar = () => {
    const { logout } = useAdminAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: BookOpen, label: 'Products' },
        { path: '/admin/categories', icon: Tag, label: 'Categories' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-amber-200/30 z-50">
            <div className="p-6 border-b border-amber-200/30">
                <h2 className="font-serif text-2xl font-bold text-[#174D3B]">
                    Dhawa <span className="text-emerald-700">Admin</span>
                </h2>
            </div>

            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-200/30">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;