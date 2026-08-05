// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaEnvelope, FaLock, FaUserPlus, FaFacebook, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log('Form submitted:', formData);
    // navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100/50"
      >
        {/* ─── Header ────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-8 text-center">
          <h1 className="text-2xl font-serif font-bold text-white">
            {isLogin ? 'স্বাগতম' : 'অ্যাকাউন্ট তৈরি করুন'}
          </h1>
          <p className="text-emerald-100/80 text-sm mt-1">
            {isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </p>
        </div>

        {/* ─── Social Login ──────────────────────────────────── */}
        <div className="px-6 pt-6">
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 rounded-lg hover:bg-[#0d6bd4] transition text-sm font-medium">
              <FaFacebook size={16} /> ফেসবুক
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#DB4437] text-white py-2.5 rounded-lg hover:bg-[#c33528] transition text-sm font-medium">
              <FaGoogle size={16} /> গুগল
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400">অথবা</span>
            </div>
          </div>
        </div>

        {/* ─── Form ──────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পূর্ণ নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                placeholder="আপনার পূর্ণ নাম"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল ঠিকানা <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                মনে রাখুন
              </label>
              <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-semibold hover:from-emerald-800 hover:to-emerald-900 transition shadow-lg shadow-emerald-700/30 hover:shadow-xl"
          >
            {isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>

          <div className="text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                নতুন ব্যবহারকারী?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  রেজিস্টার করুন
                </button>
              </>
            ) : (
              <>
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  লগইন করুন
                </button>
              </>
            )}
          </div>

          {/* ─── Register Notice ────────────────────────────── */}
          {!isLogin && (
            <div className="mt-2 p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-gray-600 leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">ℹ️</span>
                <span>
                  এই সাইটে রেজিস্টার করলে আপনি আপনার অর্ডার স্ট্যাটাস এবং ইতিহাস দেখতে পাবেন। 
                  শুধুমাত্র কেনার প্রক্রিয়াটি দ্রুত ও সহজ করার জন্য প্রয়োজনীয় তথ্যই চাওয়া হবে।
                </span>
              </p>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;