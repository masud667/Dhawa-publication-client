import { LogOut } from 'lucide-react';
// import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminHeader = () => {
    //   const { logout } = useAdminAuth();

    return (
        <header className="bg-white border-b border-amber-200/30 px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[#174D3B]">
                    Dashboard
                </h1>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;