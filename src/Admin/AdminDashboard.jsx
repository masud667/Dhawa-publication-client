// src/Pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
    ShoppingBag,
    DollarSign,
    Users,
    BookOpen,
    TrendingUp,
    RefreshCw,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import api from '../api/axios';


const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalBooks: 0,
        totalUsers: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ড্যাশবোর্ড ডাটা ফেচ করার ফাংশন
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // ১. রিসেন্ট অর্ডার ফেচ করা (আপনার ব্যাকএন্ড রাউট /orders/recent বা /orders)
            const ordersRes = await api.get('/orders');
            const allOrders = ordersRes.data.orders || ordersRes.data || [];

            // টোটাল অর্ডার এবং রেভিনিউ ক্যালকুলেশন
            const totalOrdersCount = allOrders.length;
            const calculatedRevenue = allOrders.reduce((acc, order) => {
                return acc + (Number(order.totalAmount) || 0);
            }, 0);

            // রিসেন্ট ৫টি অর্ডার ফিল্টার করা
            const latestOrders = allOrders.slice(0, 5);
            setRecentOrders(latestOrders);

            // ২. অন্যান্য স্ট্যাটস ফেচ করা (বই এবং ইউজার - যদি রাউট থাকে)
            let booksCount = 0;
            let usersCount = 0;

            try {
                const booksRes = await api.get('/books');
                booksCount = booksRes.data.length || booksRes.data.books?.length || 0;
            } catch (err) {
                console.log('Books fetch warning:', err);
            }

            setStats({
                totalOrders: totalOrdersCount,
                totalRevenue: calculatedRevenue,
                totalBooks: booksCount,
                totalUsers: usersCount || 1, // ফলব্যাক
            });

        } catch (error) {
            console.error('❌ Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // স্ট্যাটাস ব্যাজ কালার লজিক
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-emerald-100 text-emerald-700';
            case 'pending':
                return 'bg-amber-100 text-amber-700';
            case 'cancelled':
                return 'bg-rose-100 text-rose-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F5] p-4 md:p-8 text-gray-800">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header & Refresh */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-[#174D3B] md:text-3xl">
                            অ্যাডমিন ড্যাশবোর্ড
                        </h1>
                        <p className="text-sm text-gray-600">দাওয়াহ পাবলিকেশন ই-কমার্স প্ল্যাটফর্মের সারসংক্ষেপ</p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 self-start sm:self-auto"
                    >
                        <RefreshCw className="h-4 w-4" /> রিফ্রেশ করুন
                    </button>
                </div>

                {/* ─── Stats Cards Grid ────────────────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Total Revenue */}
                    <div className="rounded-2xl border border-amber-200/40 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">মোট বিক্রয় (Revenue)</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#174D3B]">৳{stats.totalRevenue.toLocaleString('bn-BD')}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="rounded-2xl border border-amber-200/40 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">মোট অর্ডার</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#174D3B]">{stats.totalOrders}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Total Books */}
                    <div className="rounded-2xl border border-amber-200/40 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">মোট বই</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#174D3B]">{stats.totalBooks}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <BookOpen className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="rounded-2xl border border-amber-200/40 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">সক্রিয় গ্রাহক</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#174D3B]">{stats.totalUsers}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ─── Recent Orders Section ────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-amber-200/30 overflow-hidden">
                    <div className="flex items-center justify-between px-5 md:px-6 py-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-semibold text-[#174D3B]">
                                সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                সর্বশেষ কাস্টমার অর্ডারগুলোর তালিকা
                            </p>
                        </div>

                        <Link
                            to="/admin/orders"
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            সব দেখুন →
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
                                            <th className="py-3 px-4">অর্ডার আইডি</th>
                                            <th className="py-3 px-4">গ্রাহক</th>
                                            <th className="py-3 px-4">পরিমাণ</th>
                                            <th className="py-3 px-4">স্ট্যাটাস</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => {
                                            const orderId = order._id ? order._id.slice(-6).toUpperCase() : 'N/A';
                                            const customerName = order.billing?.fullName || order.shipping?.fullName || order.email || 'N/A';
                                            const amount = order.totalAmount || 0;
                                            const status = order.status || 'pending';

                                            return (
                                                <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 font-semibold text-gray-800">#{orderId}</td>
                                                    <td className="py-3 px-4 text-gray-900 font-medium">{customerName}</td>
                                                    <td className="py-3 px-4 font-semibold text-emerald-700">৳{amount}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                                    <ShoppingBag className="w-7 h-7 text-emerald-600" />
                                </div>
                                <h3 className="font-semibold text-gray-700">কোনো অর্ডার পাওয়া যায়নি</h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                    গ্রাহকরা অর্ডার করা মাত্রই সেগুলো এখানে প্রদর্শিত হবে।
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;