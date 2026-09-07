import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Award, Users, Target, Compass } from 'lucide-react';
import { Link } from 'react-router';

const AboutUs = () => {
    const stats = [
        { label: 'Books Published', value: '500+', icon: BookOpen },
        { label: 'Happy Readers', value: '25K+', icon: Heart },
        { label: 'Authors Featured', value: '120+', icon: Users },
        { label: 'Years of Excellence', value: '10+', icon: Award },
    ];

    const values = [
        {
            icon: Target,
            title: 'Quality Content',
            description:
                'We carefully curate and publish books that inspire, educate, and entertain readers across all genres.',
        },
        {
            icon: Heart,
            title: 'Passion for Literature',
            description:
                'Driven by an unconditional love for stories and knowledge that leave a lasting impact on our readers.',
        },
        {
            icon: Compass,
            title: 'Empowering Authors',
            description:
                'Providing a supportive platform for emerging and established authors to bring their visions to life.',
        },
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

                {/* HERO SECTION */}
                <section className="text-center max-w-3xl mx-auto space-y-4">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs md:text-sm font-semibold tracking-wider text-emerald-700 bg-emerald-100/70 px-4 py-1.5 rounded-full inline-block"
                    >
                        Dhawa Publication
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-[#174D3B] leading-tight"
                    >
                        Connecting Minds Through Powerful Stories & Knowledge
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-gray-600 leading-relaxed"
                    >
                        Welcome to Dhawa Publication. We are dedicated to nurturing literature, supporting authors, and delivering exceptional reading experiences to book enthusiasts everywhere.
                    </motion.p>
                </section>

                {/* STORY / MISSION SECTION */}
                <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100/60 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-[#174D3B]">
                            Our Journey & Mission
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                            Founded with a passion for spreading knowledge and literary art, Dhawa Publication has grown into a trusted destination for readers and writers alike. We believe every book carries the power to spark imaginations and transform perspectives.
                        </p>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                            From academic textbooks and fiction to poetry and self-help, our goal is to publish works that empower, inspire, and entertain. We prioritize craftsmanship, editorial integrity, and seamless accessibility for our reading community.
                        </p>

                        <div className="pt-2">
                            <Link
                                to="/books"
                                className="inline-flex items-center gap-2 bg-[#174D3B] text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-[#113a2c] transition duration-200"
                            >
                                <BookOpen className="w-5 h-5" />
                                Explore Our Collection
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-2xl overflow-hidden shadow-md bg-emerald-900/10 min-h-[300px] flex items-center justify-center p-8 border border-emerald-100"
                    >
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                                <BookOpen className="w-8 h-8 text-[#174D3B]" />
                            </div>
                            <blockquote className="italic text-base md:text-lg font-medium text-[#174D3B] max-w-md">
                                "A book is a gift you can open again and again."
                            </blockquote>
                            <p className="text-xs text-gray-500 font-semibold tracking-wide">
                                — DHAWA PUBLICATION EDITORIAL TEAM
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* STATS SECTION */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-5 md:p-6 rounded-2xl border border-emerald-100/60 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto text-[#174D3B]">
                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-[#174D3B]">
                                    {stat.value}
                                </h3>
                                <p className="text-xs md:text-sm font-medium text-gray-500">
                                    {stat.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </section>

                {/* CORE VALUES */}
                <section className="space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#174D3B]">
                            Why Choose Dhawa Publication?
                        </h2>
                        <p className="text-sm text-gray-500">
                            Our core values guide everything we publish and print.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-emerald-100/60 shadow-sm space-y-3 hover:border-emerald-300 transition-colors"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-emerald-100/60 flex items-center justify-center text-[#174D3B]">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutUs;