import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
    BookOpen,
    ShoppingBag,
    Users,
    Star,
    TrendingUp,
    ArrowUpRight,
} from 'lucide-react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalReviews: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================
    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            try {
                // Fetch stats and recent orders in parallel
                const [statsRes, ordersRes] = await Promise.allSettled([
                    api.get('/admin/stats'),

                ]);

                if (isMounted) {
                    if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
                        const data = statsRes.value.data;
                        setStats({
                            totalBooks: data.totalBooks || 0,
                            totalOrders: data.totalOrders || 0,
                            totalUsers: data.totalUsers || 0,
                            totalReviews: data.totalReviews || 0,
                        });
                    }

                    if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value?.data)) {
                        setRecentOrders(ordersRes.value.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    // ==========================================
    // STAT CARDS CONFIG
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

                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full w-fit">
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
                                    <Icon className={`h-6 w-6 md:h-7 md:w-7 ${card.iconColor}`} />
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
                    <Link
                        to="/admin/books/create"
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
                    </Link>

                    <Link
                        to="/admin/books"
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
                    </Link>

                    <Link
                        to="/admin/orders"
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
                    </Link>
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

                    <Link
                        to="/admin/orders"
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        View All
                    </Link>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="py-3 px-4">Order ID</th>
                                        <th className="py-3 px-4">Customer</th>
                                        <th className="py-3 px-4">Amount</th>
                                        <th className="py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium text-gray-800">#{order._id?.slice(-6) || order.id}</td>
                                            <td className="py-3 px-4">{order.user?.name || order.customerName || 'N/A'}</td>
                                            <td className="py-3 px-4">${order.totalAmount || order.price || 0}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                                                    {order.status || 'Completed'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;