// src/Pages/Admin/AdminReviews.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Trash2,
    CheckCircle2,
    XCircle,
    Search,
    MessageSquare,
    RefreshCw,
    BookOpen,
    User,
    ShieldCheck,
} from 'lucide-react';
import api from '../../api/axios';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');

    // রিভিউ ফেচ করা
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/reviews'); // আপনার ব্যাকএন্ড রাউট অনুযায়ী
            setReviews(Array.isArray(data) ? data : data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // ডেমো ডাটা ফলব্যাক (যদি ব্যাকএন্ড রাউট পরে সেট করেন)
            setReviews([
                {
                    _id: 'rev1',
                    bookTitle: 'আত তাবসিরাহ (২ খন্ডে বক্সসহ)',
                    userName: 'আব্দুল্লাহ আল মামুন',
                    userEmail: 'mamun@gmail.com',
                    rating: 5,
                    comment: 'বইটির প্রিন্ট কোয়ালিটি এবং বাঁধাই অসাধারণ। প্রতিটি মুসলিমের পড়া উচিত।',
                    status: 'approved',
                    createdAt: new Date(),
                },
                {
                    _id: 'rev2',
                    bookTitle: 'নফসের ধোঁকা ও আত্মনিয়ন্ত্রণ',
                    userName: 'তারেক রহমান',
                    userEmail: 'tareq@gmail.com',
                    rating: 4,
                    comment: 'খুবই উপকারী একটি বই। আত্মশুদ্ধির জন্য দারুণ সহায়ক।',
                    status: 'pending',
                    createdAt: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // রিভিউ স্ট্যাটাস আপডেট (অপ্রুভ বা রিজেক্ট)
    const handleStatusChange = async (reviewId, newStatus) => {
        try {
            await api.patch(`/reviews/${reviewId}/status`, { status: newStatus });
            setReviews((prev) =>
                prev.map((rev) => (rev._id === reviewId ? { ...rev, status: newStatus } : rev))
            );
        } catch (error) {
            console.error('Error updating review status:', error);
            // লোকাল স্টেট আপডেট করে দেওয়া ডেমো বা ফেইল সেইফের জন্য
            setReviews((prev) =>
                prev.map((rev) => (rev._id === reviewId ? { ...rev, status: newStatus } : rev))
            );
        }
    };

    // রিভিউ ডিলিট করা
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('আপনি কি নিশ্চিত এই রিভিউটি মুছে ফেলতে চান?')) return;

        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
            setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
        }
    };

    // ফিল্টার ও সার্চ লজিক
    const filteredReviews = reviews.filter((rev) => {
        const matchesSearch =
            rev.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rev.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rev.comment?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRating = ratingFilter === 'all' || rev.rating.toString() === ratingFilter;

        return matchesSearch && matchesRating;
    });

    return (
        <div className="min-h-screen bg-[#FAF9F5] p-4 md:p-8 text-gray-800">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-[#174D3B] md:text-3xl">
                            রিভিউ ম্যানেজমেন্ট
                        </h1>
                        <p className="text-sm text-gray-600">গ্রাহকদের বইয়ের রিভিউ ও রেটিংসমূহ মডারেট করুন</p>
                    </div>
                    <button
                        onClick={fetchReviews}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" /> রিফ্রেশ করুন
                    </button>
                </div>

                {/* Search & Rating Filter Bar */}
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="বইয়ের নাম, ইউজারের নাম বা কমেন্ট দিয়ে খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {['all', '5', '4', '3', '2', '1'].map((rate) => (
                            <button
                                key={rate}
                                onClick={() => setRatingFilter(rate)}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${ratingFilter === rate
                                        ? 'bg-emerald-700 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {rate === 'all' ? 'সকল রেটিং' : `${rate} স্টার`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews Grid/List */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-amber-200/40 bg-white text-gray-500 shadow-sm">
                        <MessageSquare className="mb-2 h-12 w-12 text-gray-300" />
                        <p className="text-base font-medium">কোনো রিভিউ পাওয়া যায়নি</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredReviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col justify-between rounded-2xl border border-amber-200/40 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div>
                                    {/* Top: Book Title & Status */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#174D3B] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                            <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                            <span className="line-clamp-1">{review.bookTitle}</span>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${review.status === 'approved'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-amber-100 text-amber-800'
                                                }`}
                                        >
                                            {review.status === 'approved' ? 'অনুমোদিত' : 'পেন্ডিং'}
                                        </span>
                                    </div>

                                    {/* Stars & User Info */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                                        </span>
                                    </div>

                                    {/* Review Comment */}
                                    <p className="text-sm text-gray-700 leading-relaxed mb-4 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                                        "{review.comment}"
                                    </p>
                                </div>

                                {/* Footer: User Details & Actions */}
                                <div className="border-t border-gray-100 pt-3 mt-auto">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                                                {review.userName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900">{review.userName}</p>
                                                <p className="text-[10px] text-gray-500">{review.userEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between gap-2">
                                        {review.status === 'pending' ? (
                                            <button
                                                onClick={() => handleStatusChange(review._id, 'approved')}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> অনুমোদন করুন
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(review._id, 'pending')}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                            >
                                                <ShieldCheck className="h-4 w-4" /> পেন্ডিং করুন
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100"
                                            title="রিভিউ ডিলিট করুন"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;