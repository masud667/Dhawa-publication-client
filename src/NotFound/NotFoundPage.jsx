import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, ArrowRight } from 'lucide-react';

const NotFoundPage = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const canvasRef = useRef(null);

    // ─── Particle Background ──────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const particleCount = 80;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 165, 89, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        setIsLoaded(true);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ─── Mouse Parallax ──────────────────────────────────────────
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 30,
                y: (e.clientY / window.innerHeight - 0.5) * 30,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0A1A14] via-[#143A2E] to-[#0D2B22] flex items-center justify-center px-4">

            {/* ─── Canvas Background ────────────────────────────────── */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* ─── Islamic Geometric Pattern ────────────────────────── */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="pattern-404-v2" width="25" height="25" patternUnits="userSpaceOnUse">
                            <path d="M12.5 0 L25 12.5 L12.5 25 L0 12.5 Z" stroke="#D4A559" strokeWidth="0.5" fill="none" />
                            <circle cx="12.5" cy="12.5" r="2" fill="#D4A559" />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#pattern-404-v2)" />
                </svg>
            </div>

            {/* ─── Floating Orbs ──────────────────────────────────────── */}
            <motion.div
                className="absolute top-[5%] left-[3%] w-72 h-72 rounded-full bg-[#D4A559] opacity-[0.04] blur-3xl"
                animate={{ x: mousePos.x * -1.2, y: mousePos.y * -1.2 }}
                transition={{ type: 'spring', damping: 30, mass: 0.5 }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-[#0D7C66] opacity-[0.04] blur-3xl"
                animate={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2 }}
                transition={{ type: 'spring', damping: 30, mass: 0.5 }}
            />

            {/* ─── Arabic Calligraphy ────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 0.08, rotate: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute top-12 right-12 text-[#D4A559] text-5xl md:text-7xl font-serif pointer-events-none select-none"
            >
                بسم الله
            </motion.div>

            {/* ─── Decorative Star ───────────────────────────────────── */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-16 left-12 text-[#D4A559] opacity-10 text-6xl pointer-events-none select-none"
            >
                ✦
            </motion.div>

            {/* ─── Main Content ──────────────────────────────────────── */}
            <div className="relative z-10 text-center max-w-3xl">

                {/* ─── 404 Number ────────────────────────────────────── */}
                <div className="flex items-center justify-center gap-2 md:gap-5 mb-6">
                    {['৪', '০', '৪'].map((digit, index) => (
                        <motion.span
                            key={index}
                            className="text-8xl md:text-9xl lg:text-[10rem] font-bold text-white"
                            style={{
                                fontFamily: 'Georgia, serif',
                                textShadow: '0 0 60px rgba(212, 165, 89, 0.15)',
                            }}
                            initial={{ opacity: 0, y: 120, rotate: index === 1 ? 0 : -15 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 120,
                                damping: 12,
                                delay: 0.2 + index * 0.15,
                            }}
                        >
                            {digit}
                        </motion.span>
                    ))}
                </div>

                {/* ─── Book Icon ────────────────────────────────────────── */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.7 }}
                    className="text-7xl mb-5"
                >
                    📖
                </motion.div>

                {/* ─── Title ───────────────────────────────────────────── */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                >
                    ওহ! পাতা খুঁজে পাওয়া যায়নি
                </motion.h1>

                {/* ─── Description ──────────────────────────────────────── */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="text-white/60 text-sm md:text-base max-w-lg mx-auto mb-8"
                >
                    আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে,
                    অথবা অস্থায়ীভাবে অনুপলব্ধ।
                </motion.p>

                {/* ─── Buttons ───────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <Link
                        to="/"
                        className="group relative px-8 py-3.5 rounded-full font-medium text-white overflow-hidden transition-all duration-300 shadow-lg shadow-emerald-700/30 flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 hover:shadow-xl hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        হোমপেজে ফিরে যান
                        <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                    </Link>

                    <Link
                        to="/books"
                        className="px-8 py-3.5 rounded-full font-medium text-white/80 border-2 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                        <BookOpen className="w-5 h-5" />
                        বই ব্রাউজ করুন
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* ─── Islamic Quote ────────────────────────────────────── */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mt-10 text-xs text-white/20 font-serif tracking-wider"
                >
                    "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ"
                    <br />
                    <span className="text-[10px] text-white/10">— আমার সফলতা শুধু আল্লাহরই সাহায্যে</span>
                </motion.p>

                {/* ─── Decorative Line ──────────────────────────────────── */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="mx-auto mt-5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#D4A559]/60 to-transparent"
                />
            </div>

            {/* ─── Corner Decorations ────────────────────────────────── */}
            <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-white/5 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-white/5 rounded-br-3xl pointer-events-none" />

            {/* ─── Small Corner Stars ────────────────────────────────── */}
            <div className="absolute top-8 right-12 text-[#D4A559] opacity-10 text-xs pointer-events-none select-none">✦</div>
            <div className="absolute bottom-12 left-8 text-[#D4A559] opacity-10 text-xs pointer-events-none select-none">✦</div>
        </div>
    );
};

export default NotFoundPage;