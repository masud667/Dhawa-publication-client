import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    ShoppingBag,
    Users,
    Star,
    TrendingUp,
    ArrowUpRight,
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalReviews: 0,
    });

    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH DASHBOARD STATS
    // ==========================================
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:5000/admin/stats'
                );

                setStats({
                    totalBooks: data.totalBooks || 0,
                    totalOrders: data.totalOrders || 0,
                    totalUsers: data.totalUsers || 0,
                    totalReviews: data.totalReviews || 0,
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);

                // Keep dashboard working even if API isn't created yet
                setStats({
                    totalBooks: 0,
                    totalOrders: 0,
                    totalUsers: 0,
                    totalReviews: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // ==========================================
    // STAT CARDS
    // ==========================================
    const cards = [
        {
            title: 'Total Books',
            value: stats.totalBooks,
            icon: BookOpen,
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            border: 'border-emerald-100',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            border: 'border-amber-100',
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            border: 'border-blue-100',
        },
        {
            title: 'Total Reviews',
            value: stats.totalReviews,
            icon: Star,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            border: 'border-purple-100',
        },
    ];

    return (
        <div className="space-y-8">

            {/* ==========================================
                PAGE HEADER
            ========================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#174D3B]">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Welcome back! Here's what's happening with Dhawa Publication.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    <span>Store Overview</span>
                </div>
            </div>

            {/* ==========================================
                STAT CARDS
            ========================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                {cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                            }}
                            className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border ${card.border} hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>

                                    <p className="text-2xl md:text-3xl font-bold text-[#174D3B] mt-2">
                                        {loading ? (
                                            <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse" />
                                        ) : (
                                            card.value.toLocaleString()
                                        )}
                                    </p>

                                    <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>Current total</span>
                                    </div>
                                </div>

                                <div
                                    className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl ${card.iconBg} flex items-center justify-center`}
                                >
                                    <Icon
                                        className={`h-6 w-6 md:h-7 md:w-7 ${card.iconColor}`}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ==========================================
                QUICK ACTIONS
            ========================================== */}
            <div>
                <h2 className="text-lg font-semibold text-[#174D3B] mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <a
                        href="/admin/books/create"
                        className="group bg-white border border-amber-200/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-emerald-600" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Add New Book
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Add a book to your store
                                    </p>
                                </div>
                            </div>

                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition" />
                        </div>
                    </a>

                    <a
                        href="/admin/books"
                        className="group bg-white border border-amber-200/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Manage Books
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        View and manage all books
                                    </p>
                                </div>
                            </div>

                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                        </div>
                    </a>

                    <a
                        href="/admin/orders"
                        className="group bg-white border border-amber-200/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        View Orders
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Manage customer orders
                                    </p>
                                </div>
                            </div>

                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition" />
                        </div>
                    </a>
                </div>
            </div>

            {/* ==========================================
                RECENT ORDERS
            ========================================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200/30 overflow-hidden">

                <div className="flex items-center justify-between px-5 md:px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-[#174D3B]">
                            Recent Orders
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Latest customer orders
                        </p>
                    </div>

                    <a
                        href="/admin/orders"
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        View All
                    </a>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">

                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                            <ShoppingBag className="w-7 h-7 text-emerald-600" />
                        </div>

                        <h3 className="font-semibold text-gray-700">
                            No recent orders
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 max-w-sm">
                            Recent customer orders will appear here once customers
                            start placing orders.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;