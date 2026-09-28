// src/Pages/Admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    Truck,
    Package,
    Phone,
    Mail,
    MapPin,
    X,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import api from '../../api/axios';


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // অর্ডার ফেচ করা (ফাইল থেকে পুরনো fetchOrders ফাংশনটি এটি দিয়ে replace করুন)
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');

            // ব্যাকএন্ডের স্ট্রাকচার অনুযায়ী ডাটা সেট করা
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.orders && Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    // স্ট্যাটাস আপডেট হ্যান্ডলার (PATCH /orders/:id/status)
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders((prev) =>
                prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
            );
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।');
        }
    };

    // অর্ডার ডিলিট হ্যান্ডলার (DELETE /orders/:id)
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('আপনি কি নিশ্চিত এই অর্ডারটি মুছে ফেলতে চান?')) return;

        try {
            await api.delete(`/orders/${orderId}`);
            setOrders((prev) => prev.filter((ord) => ord._id !== orderId));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('অর্ডার ডিলিট করতে সমস্যা হয়েছে।');
        }
    };

    // ফিল্টার ও সার্চ লজিক
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.billing?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.billing?.phone?.includes(searchQuery);

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // স্ট্যাটাস ব্যাজ ডিজাইন
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                        <Clock className="h-3.5 w-3.5" /> পেন্ডিং
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                        <Package className="h-3.5 w-3.5" /> প্রক্রিয়াদধীন
                    </span>
                );
            case 'shipped':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
                        <Truck className="h-3.5 w-3.5" /> শিপ্রড
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" /> সম্পন্ন
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                        <XCircle className="h-3.5 w-3.5" /> বাতিল
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F5] p-4 md:p-8 text-gray-800">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-[#174D3B] md:text-3xl">
                            অর্ডার ম্যানেজমেন্ট
                        </h1>
                        <p className="text-sm text-gray-600">সকল কাস্টমার অর্ডার সমূহ পরিচালনা করুন</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" /> রিফ্রেশ করুন
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="অর্ডার আইডি, নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${statusFilter === status
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all'
                                    ? 'সকল'
                                    : status === 'pending'
                                        ? 'পেন্ডিং'
                                        : status === 'processing'
                                            ? 'প্রক্রিয়াদধীন'
                                            : status === 'shipped'
                                                ? 'শিপ্রড'
                                                : status === 'delivered'
                                                    ? 'সম্পন্ন'
                                                    : 'বাতিল'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden rounded-2xl border border-amber-200/40 bg-white shadow-sm">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                            <Package className="mb-2 h-12 w-12 text-gray-300" />
                            <p className="text-base font-medium">কোনো অর্ডার পাওয়া যায়নি</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                                        <th className="py-4 px-6">অর্ডার আইডি</th>
                                        <th className="py-4 px-6">গ্রাহক</th>
                                        <th className="py-4 px-6">তারিখ</th>
                                        <th className="py-4 px-6">টোটাল অ্যামাউন্ট</th>
                                        <th className="py-4 px-6">স্ট্যাটাস</th>
                                        <th className="py-4 px-6 text-center">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id} className="transition hover:bg-gray-50/50">
                                            <td className="py-4 px-6 font-mono font-medium text-[#174D3B]">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-semibold text-gray-900">{order.billing?.fullName || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{order.billing?.phone || 'N/A'}</p>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 text-xs">
                                                {new Date(order.createdAt || Date.now()).toLocaleDateString('bn-BD')}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-emerald-700">
                                                ৳{order.totalAmount}
                                            </td>
                                            <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                >
                                                    <Eye className="h-4 w-4" /> বিস্তারিত
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && selectedOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8"
                            >
                                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-[#174D3B]">
                                            অর্ডার ডিটেইলস #{selectedOrder._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            তারিখ: {new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-6 space-y-6">
                                    {/* Status Dropdown */}
                                    <div className="flex flex-wrap items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-200">
                                        <span className="text-xs font-semibold text-gray-700">বর্তমান স্ট্যাটাস পরিবর্তন করুন:</span>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-emerald-500"
                                        >
                                            <option value="pending">পেন্ডিং</option>
                                            <option value="processing">প্রক্রিয়াদধীন</option>
                                            <option value="shipped">শিপ্রড</option>
                                            <option value="delivered">সম্পন্ন</option>
                                            <option value="cancelled">বাতিল</option>
                                        </select>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                                        <div className="rounded-xl border border-gray-200 p-4">
                                            <h4 className="font-bold text-gray-800 mb-2">গ্রাহকের তথ্য</h4>
                                            <p className="font-medium text-gray-900">{selectedOrder.billing?.fullName}</p>
                                            <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                                                <Phone className="h-3 w-3" /> {selectedOrder.billing?.phone}
                                            </p>
                                            <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                                                <Mail className="h-3 w-3" /> {selectedOrder.billing?.email}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-gray-200 p-4">
                                            <h4 className="font-bold text-gray-800 mb-2">শিপিং ঠিকানা</h4>
                                            <p className="text-gray-700 text-xs leading-relaxed">
                                                {selectedOrder.shipping?.address}, থানা: {selectedOrder.shipping?.thana} ,{selectedOrder.shipping?.district}
                                            </p>
                                            <p className="text-xs font-semibold text-emerald-700 mt-2">
                                                পেমেন্ট পদ্ধতি: {selectedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : selectedOrder.paymentMethod}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3">অর্ডারকৃত বইসমূহ</h4>
                                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                                            {selectedOrder.orderItems?.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={item.image || '/default-book.jpg'}
                                                            alt={item.title}
                                                            className="h-10 w-8 rounded border object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                                                            <p className="text-xs text-gray-500">পরিমাণ: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-emerald-700">৳{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="rounded-xl bg-gray-50 p-4 space-y-1.5 text-sm border border-gray-200">
                                        <div className="flex justify-between text-gray-600">
                                            <span>সাবটোটাল</span>
                                            <span>৳{selectedOrder.subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>ডেলিভারি চার্জ</span>
                                            <span>৳{selectedOrder.shippingCost}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-[#174D3B]">
                                            <span>মোট মূল্য</span>
                                            <span className="text-emerald-700">৳{selectedOrder.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <button
                                        onClick={() => handleDeleteOrder(selectedOrder._id)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                        <Trash2 className="h-4 w-4" /> অর্ডার মুছুন
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-xl bg-gray-200 px-6 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-300"
                                    >
                                        বন্ধ করুন
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminOrders;