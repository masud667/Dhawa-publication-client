import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingBag, Users, Star } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalReviews: 0,
    });
    const [loading, setLoading] = useState(true);

    //   useEffect(() => {
    //     const fetchStats = async () => {
    //       try {
    //         const token = localStorage.getItem('admin-token');
    //         const { data } = await axios.get('http://localhost:5000/api/admin/stats', {
    //           headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setStats(data);
    //       } catch (error) {
    //         console.error('Error fetching stats:', error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    //     fetchStats();
    //   }, []);

    const cards = [
        { title: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'emerald' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'amber' },
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
        { title: 'Total Reviews', value: stats.totalReviews, icon: Star, color: 'purple' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#174D3B] mb-6">Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/30"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>
                                <p className="text-2xl font-bold text-[#174D3B] mt-1">
                                    {loading ? '...' : card.value}
                                </p>
                            </div>
                            <div className={`h-12 w-12 rounded-xl bg-${card.color}-100 flex items-center justify-center`}>
                                <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-amber-200/30">
                <h2 className="text-lg font-semibold text-[#174D3B] mb-4">Recent Orders</h2>
                <p className="text-gray-500 text-sm">Recent orders will appear here</p>
            </div>
        </div>
    );
};

export default AdminDashboard;