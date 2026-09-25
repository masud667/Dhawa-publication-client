import React from 'react';
import { motion } from 'framer-motion';
import {
    FaBookOpen,
    FaHeart,
    FaCheckCircle,
    FaFeatherAlt,
    FaLanguage,
    FaGem,
    FaHandsHelping
} from 'react-icons/fa';

const AboutUs = () => {
    // Motion animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const points = [
        {
            id: "01",
            icon: <FaHandsHelping className="text-amber-500 text-2xl" />,
            title: "১. উম্মাহর খেদমত ও দাওয়াতের অঙ্গীকার",
            desc: "আমরা বইকে শুধু ব্যবসার মাধ্যম হিসেবে দেখি না; বরং একে দাওয়াতের অন্যতম গুরুত্বপূর্ণ মাধ্যম হিসেবে বিবেচনা করি। ঘরে ঘরে সত্য ও হেদায়েতের আলো পৌঁছে দিয়ে উম্মাহর খেদমত করাই আমাদের মূল লক্ষ্য।"
        },
        {
            id: "02",
            icon: <FaCheckCircle className="text-amber-500 text-2xl" />,
            title: "২. বিশুদ্ধ ও মানসম্মত দ্বীনী জ্ঞান",
            desc: "ইসলামের মূল উৎস—কুরআন ও সহিহ সুন্নাহর আলোকে বিশুদ্ধ আকিদা ও আমলভিত্তিক গ্রন্থ প্রকাশে আমরা শতভাগ প্রতিশ্রুতিবদ্ধ। প্রতিটি বইয়ের বিষয়বস্তু যাচাই-বাছাইয়ের ক্ষেত্রে আমরা সর্বোচ্চ সতর্কতা অবলম্বন করি।"
        },
        {
            id: "03",
            icon: <FaFeatherAlt className="text-amber-500 text-2xl" />,
            title: "৩. দ্বীন ও আধুনিকতার অপূর্ব মেলবন্ধন",
            desc: "আজকের তরুণ প্রজন্ম ও পাঠকদের রুচি ও মনস্তত্ত্ব বুঝে আমরা এমন সব বিষয় নির্বাচন করি, যা একজন মানুষকে আধুনিক সময়ের চ্যালেঞ্জের মাঝেও দ্বীনের ওপর অবিচল থাকতে সাহায্য করে।"
        },
        {
            id: "04",
            icon: <FaLanguage className="text-amber-500 text-2xl" />,
            title: "৪. সাবলীল অনুবাদ ও প্রাঞ্জল সম্পাদনা",
            desc: "অন্যান্য ভাষার ক্লাসিক ও গবেষণাধর্মী দ্বীনী বইগুলোকে বাংলাভাষী পাঠকদের জন্য অত্যন্ত সহজ, প্রাঞ্জল ও আকর্ষণীয় ভাষায় উপস্থাপন করা আমাদের অন্যতম প্রধান বৈশিষ্ট্য।"
        },
        {
            id: "05",
            icon: <FaGem className="text-amber-500 text-2xl" />,
            title: "৫. দৃষ্টিবান্ধব বাঁধাই ও নিখুঁত প্রেজেন্টেশন",
            desc: "আমরা বিশ্বাস করি, দ্বীনী বইয়ের পরিবেশনাও হতে হবে দৃষ্টিনন্দন। মানসম্মত কাগজ, স্পষ্ট টাইপোগ্রাফি, আকর্ষণীয় প্রচ্ছদ এবং মজবুত বাঁধাইয়ের মাধ্যমে আমরা পাঠকের হাতে একটি প্রিমিয়াম বই তুলে দিতে সচেষ্ট।"
        }
    ];

    return (
        <div className="bg-[#FAF9F5] min-h-screen text-gray-800 overflow-hidden">

            {/* ─── 1. HERO SECTION ───────────────────────────────────────── */}
            <section className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
                    >
                        <FaBookOpen size={14} /> আমাদের সম্পর্কে
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl sm:text-5xl font-serif font-bold text-amber-400 mb-4 tracking-wide"
                    >
                        'সুন্দর আগামীর জন্য'
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-base sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        দাওয়াতের মাধ্যমে উম্মাহর খেদমত এবং ঘরে ঘরে দ্বীনের সহিহ আহ্বান পৌঁছে দেওয়ার মহান লক্ষ্য নিয়ে আমাদের পথচলা।
                    </motion.p>
                </div>
            </section>

            {/* ─── 2. MISSION STATEMENT CARD ─────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-amber-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                            <FaHeart className="text-emerald-700" />
                        </div>

                        <div className="space-y-3 text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-900">
                                আমাদের মূল দর্শন
                            </h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                "দাওয়াতের মাধ্যমে উম্মাহর খেদমত এবং ঘরে ঘরে দ্বীনের সহিহ আহ্বান পৌঁছে দেওয়ার মহান লক্ষ্য নিয়ে দাওয়া পাবলিকেশন-এর পথচলা। আমরা বিশ্বাস করি, মানুষের অন্তর ও জীবন পরিবর্তনের সবচেয়ে নিখুঁত মাধ্যম হলো একটি উত্তম বই। বিশুদ্ধ দ্বীনী ইলম ও আখেরাতমুখী চেতনার আলো ছড়িয়ে দিয়ে উম্মাহর পাশে থাকাই আমাদের অঙ্গীকার—সুন্দর আগামীর জন্য।"
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── 3. WHY CHOOSE US SECTION ──────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

                {/* Section Heading */}
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-emerald-950">
                        কেন দাওয়া পাবলিকেশন?
                    </h2>
                    <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-2">
                        জ্ঞানই চেতনার মূল ভিত্তি, আর সেই জ্ঞান অর্জনের সবচেয়ে শক্তিশালী মাধ্যম হলো একটি উত্তম বই। হাজারো বইয়ের ভিড়ে ‘দাওয়া পাবলিকেশন’ কেন আপনার প্রথম পছন্দ হওয়া উচিত?
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {points.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={fadeInUp}
                            whileHover={{ y: -6 }}
                            className={`bg-white rounded-2xl p-7 shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col justify-between relative transition-all duration-300 ${index === 0 ? "lg:col-span-2 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white" : ""
                                }`}
                        >
                            <div>
                                {/* Header inside Card */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-50 text-emerald-800"
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full tracking-wider ${index === 0 ? "bg-amber-500 text-emerald-950" : "bg-emerald-100 text-emerald-900"
                                        }`}>
                                        {item.id}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className={`text-lg font-serif font-bold mb-3 ${index === 0 ? "text-amber-400" : "text-emerald-900"
                                    }`}>
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className={`text-sm leading-relaxed ${index === 0 ? "text-emerald-100/90" : "text-gray-600"
                                    }`}>
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ─── 4. BOTTOM CALL TO ACTION ──────────────────────────────── */}
            <section className="bg-emerald-900 text-white py-14 px-4 text-center border-t-4 border-amber-500">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                        বিশুদ্ধ দ্বীনী ইলমের আলো ছড়াতে আমাদের সাথে থাকুন
                    </h3>
                    <p className="text-emerald-100/80 text-sm sm:text-base">
                        আমাদের প্রকাশিত বইগুলো দেখতে ও অর্ডার করতে আজই অ্যাপ ঘুরে দেখুন।
                    </p>
                    <div className="pt-2">
                        <a
                            href="/books"
                            className="inline-block bg-amber-500 hover:bg-amber-400 text-emerald-950 font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-amber-500/30 text-sm"
                        >
                            বইসমূহ দেখুন
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;