import { NavLink } from 'react-router';
import {
    LayoutDashboard,
    BookOpen,
    Tag,
    ShoppingBag,
    MessageSquare,
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
            path: '/admin/categories',
            icon: Tag,
            label: 'Categories',
        },
        {
            path: '/admin/orders',
            icon: ShoppingBag,
            label: 'Orders',
        },
        {
            path: '/admin/reviews',
            icon: MessageSquare,
            label: 'Reviews',
        },
    ];

    return (
        <>
            {/* =========================================
          MOBILE OVERLAY
      ========================================= */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* =========================================
          SIDEBAR
      ========================================= */}
            <aside
                className={`
          fixed
          left-0
          top-0
          h-screen
          w-64
          bg-white
          shadow-lg
          border-r
          border-amber-200/30
          z-50

          transform
          transition-transform
          duration-300
          ease-in-out

          ${isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full lg:translate-x-0'
                    }
        `}
            >
                {/* =========================================
            SIDEBAR HEADER
        ========================================= */}
                <div className="p-6 border-b border-amber-200/30 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold text-[#174D3B]">
                        Dhawa{' '}
                        <span className="text-emerald-700">
                            Admin
                        </span>
                    </h2>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="
              lg:hidden
              p-2
              rounded-lg
              text-gray-500
              hover:text-gray-800
              hover:bg-gray-100
              transition
            "
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* =========================================
            NAVIGATION
        ========================================= */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-145px)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <Icon className="h-5 w-5" />

                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* =========================================
            LOGOUT
        ========================================= */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-200/30 bg-white">
                    <button
                        type="button"
                        onClick={logout}
                        className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              rounded-lg
              text-red-600
              hover:bg-red-50
              transition
            "
                    >
                        <LogOut className="h-5 w-5" />

                        <span className="font-medium">
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;