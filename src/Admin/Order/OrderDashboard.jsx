import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Search,
    Filter,
    Eye,
    Trash2,
    Package,
    RefreshCw,
    X,
    User,
    Mail,
    Calendar,
} from 'lucide-react';
import api from '../../api/axios';
import AuthSecureAxios from '../../Hook/AuthSecureAxios';

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // ==========================================
    // FETCH ORDERS
    // ==========================================
    // Inside OrderDashboard.jsx
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await AuthSecureAxios.get('/orders');
            if (response.data?.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            // ✅ Only log the error, do NOT clear localStorage or redirect
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================
    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await api.patch(`/orders/${orderId}/status`, {
                status: newStatus,
            });

            if (response.data?.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status');
        } finally {
            setUpdatingId(null);
        }
    };

    // ==========================================
    // DELETE ORDER
    // ==========================================
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        setDeletingId(orderId);
        try {
            const response = await api.delete(`/orders/${orderId}`);
            if (response.data?.success) {
                setOrders((prev) => prev.filter((o) => o._id !== orderId));
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(null);
                }
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Failed to delete order');
        } finally {
            setDeletingId(null);
        }
    };

    // ==========================================
    // FILTERING LOGIC
    // ==========================================
    const filteredOrders = orders.filter((order) => {
        const idMatch = order._id?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = order.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const nameMatch = order.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSearch = idMatch || emailMatch || nameMatch;
        const matchesStatus =
            statusFilter === 'all' ||
            order.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    // Helper for Status Badge Styling
    const getStatusBadge = (status) => {
        const normalized = status?.toLowerCase();
        switch (normalized) {
            case 'completed':
            case 'delivered':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'processing':
            case 'shipped':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#174D3B] flex items-center gap-2">
                        <ShoppingBag className="w-7 h-7 text-emerald-600" />
                        Order Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage, filter, and update customer orders.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium shadow-sm w-fit disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-amber-200/30 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, email, or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                    {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition shrink-0 ${statusFilter === status
                                ? 'bg-[#174D3B] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200/30 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="py-3.5 px-5">Order ID</th>
                                    <th className="py-3.5 px-5">Customer</th>
                                    <th className="py-3.5 px-5">Date</th>
                                    <th className="py-3.5 px-5">Items</th>
                                    <th className="py-3.5 px-5">Total</th>
                                    <th className="py-3.5 px-5">Status</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/80 transition">
                                        <td className="py-4 px-5 font-mono text-xs font-semibold text-gray-800">
                                            #{order._id ? order._id.slice(-8) : 'N/A'}
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="font-medium text-gray-900">
                                                {order.name || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-400">{order.email}</div>
                                        </td>
                                        <td className="py-4 px-5 text-xs text-gray-500 whitespace-nowrap">
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="py-4 px-5 text-gray-700">
                                            {order.items?.length || 0} item(s)
                                        </td>
                                        <td className="py-4 px-5 font-semibold text-[#174D3B]">
                                            ${order.totalAmount || order.price || 0}
                                        </td>
                                        <td className="py-4 px-5">
                                            <select
                                                value={order.status || 'pending'}
                                                disabled={updatingId === order._id}
                                                onChange={(e) =>
                                                    handleStatusUpdate(order._id, e.target.value)
                                                }
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize outline-none cursor-pointer transition ${getStatusBadge(
                                                    order.status
                                                )}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    disabled={deletingId === order._id}
                                                    className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-700 text-base">No orders found</h3>
                        <p className="text-xs text-gray-400 mt-1 max-w-sm">
                            No orders matched your active search or filter criteria.
                        </p>
                    </div>
                )}
            </div>

            {/* Slide-over Drawer Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <div>
                                    <h2 className="font-bold text-lg text-[#174D3B]">
                                        Order Details
                                    </h2>
                                    <p className="text-xs font-mono text-gray-400">
                                        ID: #{selectedOrder._id}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                    <h3 className="text-xs font-semibold uppercase text-emerald-800 tracking-wider">
                                        Customer Information
                                    </h3>
                                    <div className="space-y-1.5 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-emerald-600" />
                                            <span className="font-medium">
                                                {selectedOrder.name || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-emerald-600" />
                                            <span>{selectedOrder.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-600" />
                                            <span>
                                                {selectedOrder.createdAt
                                                    ? new Date(selectedOrder.createdAt).toLocaleString()
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-3">
                                        Purchased Items
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {item.title || item.name || 'Item'}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                Qty: {item.quantity || 1}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-sm text-[#174D3B]">
                                                        ${item.price || 0}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">
                                                No item breakdown available.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        Total Amount
                                    </span>
                                    <span className="text-xl font-bold text-[#174D3B]">
                                        ${selectedOrder.totalAmount || selectedOrder.price || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                                <button
                                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-xl transition"
                                >
                                    Delete Order
                                </button>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-5 py-2 bg-[#174D3B] text-white text-sm font-medium rounded-xl hover:bg-[#123d2f] transition"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDashboard;