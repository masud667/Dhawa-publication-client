// src/Pages/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  X,
  Gift,
  Tag,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } =
    useCartStore((state) => state);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // ─── Shipping calculation ──────────────────────────────
  const shippingCost = totalPrice > 1000 ? 0 : 60;
  const discount = promoApplied ? Math.round(totalPrice * 0.1) : 0; // 10% discount
  const subtotal = totalPrice;
  const grandTotal = subtotal + shippingCost - discount;

  // ─── Handle quantity update ─────────────────────────────
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  // ─── Handle remove item ─────────────────────────────────
  const handleRemoveItem = (id, title) => {
    if (window.confirm(`"${title}" সরাতে চান?`)) {
      removeItem(id);
    }
  };

  // ─── Handle promo code ──────────────────────────────────
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === 'dhawa10') {
      setPromoApplied(true);
      setPromoDiscount(Math.round(totalPrice * 0.1));
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  // ─── Handle checkout ────────────────────────────────────
  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 800);
  };

  // ─── Empty Cart ──────────────────────────────────────────
  if (totalItems === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF9F5] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-emerald-100">
            <ShoppingBag className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#174D3B]">কার্ট খালি</h2>
          <p className="mt-3 text-gray-500">আপনার কার্টে এখনো কোনো বই নেই।</p>
          <Link
            to="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-3 font-medium text-white shadow-lg shadow-emerald-700/30 transition hover:scale-105 hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            বই ব্রাউজ করুন
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      {/* ─── Geometric Pattern Background ────────────────── */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cartPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" stroke="#B8860B" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#B8860B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cartPattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto max-w-[1200px] px-4">
        {/* ─── Header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#174D3B] md:text-4xl">
              আমার <span className="text-emerald-700">কার্ট</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{totalItems}টি আইটেম</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            সকল সরান
          </button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* ─── Cart Items ──────────────────────────────────── */}
          <div>
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200/30 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-nowrap"
                  >
                    {/* ─── Image ────────────────────────────── */}
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-[#EEE9DF]">
                      <img
                        src={item.image || '/default-book.jpg'}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* ─── Info ──────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base font-semibold text-[#174D3B] line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">৳{item.price}</p>
                    </div>

                    {/* ─── Quantity ──────────────────────────── */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-semibold text-[#174D3B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* ─── Price + Remove ────────────────────── */}
                    <div className="flex items-center gap-4">
                      <span className="min-w-[80px] text-right font-bold text-emerald-700">
                        ৳{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="text-gray-400 transition hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ─── Continue Shopping ────────────────────────── */}
            <Link
              to="/books"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              আরও বই ব্রাউজ করুন
            </Link>
          </div>

          {/* ─── Order Summary ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="sticky top-24"
          >
            <div className="rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg">
              <h2 className="font-serif text-xl font-bold text-[#174D3B] border-b border-amber-200/30 pb-4">
                অর্ডার সারাংশ
              </h2>

              <div className="mt-4 space-y-3">
                {/* ─── Subtotal ───────────────────────────────── */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">সাবটোটাল</span>
                  <span className="font-medium text-[#174D3B]">৳{subtotal}</span>
                </div>

                {/* ─── Shipping ───────────────────────────────── */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ডেলিভারি চার্জ</span>
                  <span className="font-medium text-[#174D3B]">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600">ফ্রি</span>
                    ) : (
                      `৳${shippingCost}`
                    )}
                  </span>
                </div>

                {/* ─── Discount ───────────────────────────────── */}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ছাড় (10%)</span>
                    <span className="font-medium text-red-500">-৳{discount}</span>
                  </div>
                )}

                {/* ─── Divider ────────────────────────────────── */}
                <div className="border-t border-amber-200/30 pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-[#174D3B]">মোট</span>
                    <span className="text-emerald-700">৳{grandTotal}</span>
                  </div>
                  {shippingCost === 0 && totalPrice > 0 && (
                    <p className="mt-1 text-xs text-emerald-600">
                      ✓ ফ্রি ডেলিভারি (১০০০৳ এর বেশি)
                    </p>
                  )}
                </div>

                {/* ─── Promo Code ─────────────────────────────── */}
                <form onSubmit={handlePromoSubmit} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="প্রোমো কোড"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    disabled={promoApplied}
                  />
                  <button
                    type="submit"
                    disabled={promoApplied}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {promoApplied ? 'প্রযোজ্য' : 'প্রয়োগ'}
                  </button>
                </form>

                {promoApplied && (
                  <p className="text-xs text-emerald-600">
                    ✓ "DHAWA10" কোড প্রযোজ্য হয়েছে!
                  </p>
                )}

                {/* ─── Checkout Button ────────────────────────── */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      প্রক্রিয়াকরণ...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      চেকআউটে যান
                    </>
                  )}
                </button>

                {/* ─── Trust Badges ───────────────────────────── */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-amber-200/30 pt-4">
                  <div className="text-center">
                    <Shield className="mx-auto h-5 w-5 text-emerald-600" />
                    <p className="mt-1 text-[10px] text-gray-500">নিরাপদ</p>
                  </div>
                  <div className="text-center">
                    <Truck className="mx-auto h-5 w-5 text-emerald-600" />
                    <p className="mt-1 text-[10px] text-gray-500">দ্রুত ডেলিভারি</p>
                  </div>
                  <div className="text-center">
                    <Gift className="mx-auto h-5 w-5 text-emerald-600" />
                    <p className="mt-1 text-[10px] text-gray-500">সেরা অফার</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;