import {
    LogOut,
    Menu,
} from 'lucide-react';

import useAdminAuth from '../useAdminAuth';

const AdminHeader = ({ onMenuClick }) => {
    const { logoutAdmin: logout } = useAdminAuth();

    return (
        <header className="bg-white border-b border-amber-200/30 px-4 sm:px-6 py-4 ">
            <div className="flex items-center justify-between">

                {/* =========================================
            LEFT SIDE
        ========================================= */}
                <div className="flex items-center gap-3">

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="
              lg:hidden
              p-2
              rounded-lg
              text-gray-600
              hover:text-[#174D3B]
              hover:bg-emerald-50
              transition
            "
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <h1 className="text-lg sm:text-xl font-semibold text-[#174D3B]">
                        Dashboard
                    </h1>
                </div>


            </div>
        </header>
    );
};

export default AdminHeader;