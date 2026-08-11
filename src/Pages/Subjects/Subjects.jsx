import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    BookOpen, TrendingUp, Users, Sparkles, Heart, Star, Clock, Compass, Layers,
    ChevronRight
} from 'lucide-react';
import axios from 'axios';

// ─── Map category names to icons ──────────────────────────────
const subjectIcons = {
    'ইসলামিক': <BookOpen />,
    'কুরআন': <BookOpen />,
    'সীরাত': <Star />,
    'আত্মউন্নয়ন': <TrendingUp />,
    'আখিরাত': <Compass />,
    'আকিদা': <Sparkles />,
    'আখলাক': <Heart />,
    'পরিবার': <Users />,
    'জীবনবিধান': <Layers />,
    'নারী': <Users />,
    'মাতৃত্ব': <Heart />,
    'আমল': <Sparkles />,
    'তাযকিয়া': <Sparkles />,
    'তাওবা': <Heart />,
    'যিকির': <Star />,
    'তালীম': <BookOpen />,
    'শিশু': <TrendingUp />,
    default: <Layers />,
};

// ─── Gradients for cards ──────────────────────────────────────
const gradients = [
    { from: 'from-emerald-600', to: 'to-teal-600', bg: 'from-emerald-50 to-teal-50' },
    { from: 'from-amber-500', to: 'to-orange-500', bg: 'from-amber-50 to-orange-50' },
    { from: 'from-rose-500', to: 'to-pink-500', bg: 'from-rose-50 to-pink-50' },
    { from: 'from-sky-500', to: 'to-blue-500', bg: 'from-sky-50 to-blue-50' },
    { from: 'from-violet-500', to: 'to-purple-500', bg: 'from-violet-50 to-purple-50' },
    { from: 'from-indigo-500', to: 'to-blue-600', bg: 'from-indigo-50 to-blue-50' },
    { from: 'from-teal-500', to: 'to-cyan-500', bg: 'from-teal-50 to-cyan-50' },
    { from: 'from-orange-500', to: 'to-red-500', bg: 'from-orange-50 to-red-50' },
];

// ─── Custom hook for 3D tilt ───────────────────────────────────
const useTilt = () => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { damping: 25, stiffness: 400 });
    const springY = useSpring(y, { damping: 25, stiffness: 400 });
    const rotateX = useTransform(springY, [-1, 1], [12, -12]);
    const rotateY = useTransform(springX, [-1, 1], [-12, 12]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
};

// ─── Individual Subject Card (uses useTilt internally) ────────
const SubjectCard = ({ subject, index }) => {
    const IconComponent = subjectIcons[subject.name] || subjectIcons.default;
    const grad = gradients[index % gradients.length];
    const tilt = useTilt(); // Hook called consistently per card

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -12, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={tilt.handleMouseMove}
            onMouseLeave={tilt.handleMouseLeave}
            ref={tilt.ref}
            className="group relative perspective-1000"
        >
            <Link to={`/category/${subject.slug}`} className="block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-2xl border border-amber-200/30 hover:border-amber-300/50">
                    {/* ─── Gradient Background (subtle) ────────── */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${grad.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* ─── Decorative Corner Pattern ───────────── */}
                    <div className="absolute -top-8 -right-8 h-24 w-24 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" stroke="#B8860B" strokeWidth="2" />
                            <circle cx="50" cy="50" r="25" stroke="#B8860B" strokeWidth="1.5" />
                            <circle cx="50" cy="50" r="8" fill="#B8860B" />
                        </svg>
                    </div>

                    {/* ─── Icon ────────────────────────────────── */}
                    <div className={`relative z-10 mb-4 inline-flex rounded-xl p-4 text-emerald-500 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-110 ${grad.from} ${grad.to}`}>
                        {IconComponent}
                    </div>

                    {/* ─── Name ────────────────────────────────── */}
                    <h3 className="relative z-10 font-serif text-lg font-bold text-[#174d3b] transition-colors duration-300 group-hover:text-emerald-700">
                        {subject.name}
                    </h3>

                    {/* ─── Count ────────────────────────────────── */}
                    <p className="relative z-10 mt-1 text-sm text-gray-500">
                        {subject.count || 0}টি বই
                    </p>

                    {/* ─── Decorative Line ────────────────────── */}
                    <div className="relative z-10 mt-3 h-0.5 w-8 rounded-full bg-amber-400/50 transition-all duration-300 group-hover:w-12 group-hover:bg-amber-500" />

                    {/* ─── Floating Dot ─────────────────────────── */}
                    <div className="absolute bottom-4 left-4 z-10 h-2 w-2 rounded-full bg-emerald-400/20 transition-all duration-300 group-hover:bg-emerald-500 group-hover:scale-150" />

                    {/* ─── Arrow on Hover ───────────────────────── */}
                    <div className="absolute bottom-4 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// ─── Main Subjects Component ────────────────────────────────────
const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    // ─── Fetch subjects from backend ──────────────────────────────
    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { data } = await axios.get(
                    'https://dhawa-publication-server.vercel.app/categories'
                );

                if (Array.isArray(data) && data.length > 0) {
                    setSubjects(data);
                } else {
                    setSubjects([]);
                    setError('কোনো বিষয় পাওয়া যায়নি।');
                }
            } catch (err) {
                console.error('❌ Error fetching subjects:', err);

                setSubjects([]);
                setError(
                    'ডেটাবেস থেকে বিষয় লোড করতে সমস্যা হয়েছে। সার্ভার চালু আছে কিনা যাচাই করুন।'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubjects();
    }, []);
    // ─── Loading State ─────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f7f4ee] py-16">
                <div className="container mx-auto max-w-[1200px] px-4">
                    <div className="mb-12 text-center">
                        <div className="mx-auto h-12 w-56 animate-pulse rounded bg-[#d9d3c8]" />
                        <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-[#d9d3c8]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-2xl bg-[#d9d3c8] animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ─── Error State ──────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-[#f7f4ee] py-16 flex items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-red-700">বিষয় লোড করতে সমস্যা</h3>
                    <p className="mt-2 text-sm text-gray-600">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        আবার চেষ্টা করুন
                    </button>
                </div>
            </div>
        );
    }

    // ─── Empty State ──────────────────────────────────────────────
    if (subjects.length === 0) {
        return (
            <div className="min-h-screen bg-[#f7f4ee] py-16 flex items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                        <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#263d35]">কোনো বিষয় পাওয়া যায়নি</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        আপনার বইগুলোর <code className="bg-gray-100 px-1">category</code> ফিল্ডে কোনো মান নেই।
                    </p>
                </div>
            </div>
        );
    }

    // ─── Main Render ──────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f7f4ee] py-16 relative overflow-hidden" ref={containerRef}>
            {/* ─── Background Pattern ────────────────────────────────── */}
            <div className="pointer-events-none fixed inset-0 opacity-[0.03]">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="subjectPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M30 0 L60 30 L30 60 L0 30 Z" stroke="#B8860B" strokeWidth="0.5" fill="none" />
                            <circle cx="30" cy="30" r="4" fill="#B8860B" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#subjectPattern)" />
                </svg>
            </div>

            <div className="container relative z-10 mx-auto max-w-[1200px] px-4">
                {/* ─── Header ──────────────────────────────────────────── */}
                <div className="mb-12 text-center">
                    <h1 className="font-serif text-3xl font-bold text-[#174d3b] md:text-4xl lg:text-5xl">
                        বইয়ের <span className="text-emerald-700">বিষয়সমূহ</span>
                    </h1>
                    <div className="mx-auto mt-3 h-0.5 w-20 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
                    <p className="mt-4 text-sm text-gray-500 md:text-base">
                        {subjects.length}টি বিষয়ে {subjects.reduce((acc, s) => acc + (s.count || 0), 0)}টি বই পাওয়া যায়
                    </p>
                </div>

                {/* ─── Subjects Grid ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
                >
                    {subjects.map((subject, index) => (
                        <SubjectCard key={subject.name + index} subject={subject} index={index} />
                    ))}
                </motion.div>

                {/* ─── Decorative Footer ────────────────────────────────── */}
                <div className="mt-16 flex items-center justify-center gap-4">
                    <span className="h-px w-16 bg-amber-300" />
                    <span className="text-xs font-medium uppercase tracking-widest text-amber-600">
                        Explore Topics
                    </span>
                    <span className="h-px w-16 bg-amber-300" />
                </div>
            </div>
        </div>
    );
};

export default Subjects;