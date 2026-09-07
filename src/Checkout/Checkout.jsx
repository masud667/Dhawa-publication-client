// src/Pages/Checkout/Checkout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
  Home,
  Wallet,
  Shield,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';

// ─── Bangladesh Districts (All 64) ──────────────────────────────
const bangladeshDistricts = [
  'বরগুনা', 'বরিশাল', 'ভোলা', 'ঝালকাঠি', 'পটুয়াখালী', 'পিরোজপুর',
  'বান্দরবান', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'চট্টগ্রাম', 'কুমিল্লা', 'কক্সবাজার',
  'ফেনী', 'খাগড়াছড়ি', 'লক্ষ্মীপুর', 'নোয়াখালী', 'রাঙ্গামাটি',
  'ঢাকা', 'ফরিদপুর', 'গাজীপুর', 'গোপালগঞ্জ', 'কিশোরগঞ্জ', 'মাদারীপুর',
  'মানিকগঞ্জ', 'মুন্সীগঞ্জ', 'নারায়ণগঞ্জ', 'নরসিংদী', 'রাজবাড়ী', 'শরীয়তপুর', 'টাঙ্গাইল',
  'বাগেরহাট', 'চুয়াডাঙ্গা', 'যশোর', 'ঝিনাইদহ', 'খুলনা', 'কুষ্টিয়া',
  'মাগুরা', 'মেহেরপুর', 'নড়াইল', 'সাতক্ষীরা',
  'জামালপুর', 'ময়মনসিংহ', 'নেত্রকোণা', 'শেরপুর',
  'বগুড়া', 'জয়পুরহাট', 'নওগাঁ', 'নাটোর', 'চাঁপাইনবাবগঞ্জ', 'পাবনা', 'রাজশাহী', 'সিরাজগঞ্জ',
  'দিনাজপুর', 'গাইবান্ধা', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী', 'পঞ্চগড়', 'রংপুর', 'ঠাকুরগাঁও',
  'হবিগঞ্জ', 'মৌলভীবাজার', 'সুনামগঞ্জ', 'সিলেট',
];

// ─── Steps Configuration ──────────────────────────────────────────
const STEPS = [
  { id: 'address', label: 'ঠিকানা', icon: MapPin },
  { id: 'payment', label: 'পেমেন্ট', icon: CreditCard },
  { id: 'confirm', label: 'নিশ্চিতকরণ', icon: Check },
];

// ─── Main Checkout Component ──────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore((state) => state);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState({});

  // ─── Form Data ──────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    billing: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      postCode: '',
    },
    shipping: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      postCode: '',
    },
    orderNotes: '',
    paymentMethod: 'cod',
    isGuest: true,
  });

  // ─── Input Change Handler (supports nested fields) ──────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [prefix, field] = name.split('.');
      if (prefix === 'billing' || prefix === 'shipping') {
        setFormData((prev) => ({
          ...prev,
          [prefix]: { ...prev[prefix], [field]: value },
        }));
        // Clear error for this field
        if (errors[prefix]?.[field]) {
          setErrors((prev) => ({
            ...prev,
            [prefix]: { ...prev[prefix], [field]: '' },
          }));
        }
        return;
      }
    }

    // Top-level fields (orderNotes, paymentMethod)
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ─── Toggle Same as Billing ─────────────────────────────────────
  const handleSameAsBillingToggle = (checked) => {
    setSameAsBilling(checked);
    if (checked) {
      setErrors((prev) => ({ ...prev, shipping: {} }));
    }
  };

  // ─── Address Validation ─────────────────────────────────────────
  const validateAddress = (data) => {
    const err = {};
    if (!data.fullName?.trim()) err.fullName = 'নাম প্রয়োজন';
    if (!data.phone?.trim()) err.phone = 'ফোন নম্বর প্রয়োজন';
    if (!data.address?.trim()) err.address = 'ঠিকানা প্রয়োজন';
    if (!data.district?.trim()) err.district = 'জেলা নির্বাচন করুন';
    if (!data.postCode?.trim()) err.postCode = 'পোস্ট কোড প্রয়োজন';
    if (!data.email?.trim()) err.email = 'ইমেইল প্রয়োজন';
    else if (!/\S+@\S+\.\S+/.test(data.email)) err.email = 'সঠিক ইমেইল দিন';
    return err;
  };

  // ─── Step Validation ────────────────────────────────────────────
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      const billingErrors = validateAddress(formData.billing);
      if (Object.keys(billingErrors).length > 0) {
        newErrors.billing = billingErrors;
      }
      if (!sameAsBilling) {
        const shippingErrors = validateAddress(formData.shipping);
        if (Object.keys(shippingErrors).length > 0) {
          newErrors.shipping = shippingErrors;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Navigation ─────────────────────────────────────────────────
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === STEPS.length - 1) {
        handleSubmitOrder();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // ─── Submit Order ───────────────────────────────────────────────
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    // Prepare shipping data
    const shippingData = sameAsBilling ? formData.billing : formData.shipping;

    const orderPayload = {
      billing: formData.billing,
      shipping: shippingData,
      orderNotes: formData.orderNotes,
      paymentMethod: formData.paymentMethod,
      items: items,
      subtotal: subtotal,
      shippingCost: shippingCost,
      total: grandTotal,
    };

    try {
      // ─── Replace with your actual API call ────────────────────
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderPayload),
      // });
      // const data = await response.json();
      // setOrderNumber(data.orderNumber);

      // ─── Simulate API call ──────────────────────────────────────
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const orderId = 'DHW-' + Date.now().toString().slice(-6);
      setOrderNumber(orderId);
      clearCart();
      setCurrentStep(2);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Calculations ──────────────────────────────────────────────
  const subtotal = totalPrice;
  const shippingCost = subtotal > 1000 ? 0 : 60;
  const grandTotal = subtotal + shippingCost;

  // ─── Redirect if cart empty ─────────────────────────────────────
  useEffect(() => {
    if (items.length === 0 && currentStep < 2) {
      navigate('/cart');
    }
  }, [items, navigate, currentStep]);

  // ─── Render Step Content ────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddressStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            sameAsBilling={sameAsBilling}
            onToggle={handleSameAsBillingToggle}
            districts={bangladeshDistricts}
          />
        );
      case 1:
        return <PaymentStep formData={formData} onChange={handleInputChange} />;
      case 2:
        return (
          <ConfirmationStep
            orderNumber={orderNumber}
            items={items}
            billingAddress={formData.billing}
            shippingAddress={sameAsBilling ? null : formData.shipping}
            subtotal={subtotal}
            shippingCost={shippingCost}
            grandTotal={grandTotal}
            paymentMethod={formData.paymentMethod}
            orderNotes={formData.orderNotes}
          />
        );
      default:
        return null;
    }
  };

  // ─── Main Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      {/* ─── Pattern Background ──────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="checkoutPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" stroke="#B8860B" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#B8860B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#checkoutPattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto max-w-[1100px] px-4">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#174D3B] md:text-4xl">
              চেকআউট
            </h1>
            <p className="mt-1 text-sm text-gray-500">আপনার অর্ডার সম্পন্ন করুন</p>
          </div>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            কার্টে ফিরে যান
          </Link>
        </div>

        {/* ─── Progress Steps ────────────────────────────────── */}
        <div className="mb-10 flex items-center justify-between gap-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${index < currentStep
                  ? 'bg-emerald-600 text-white'
                  : index === currentStep
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                    : 'bg-gray-200 text-gray-400'
                  }`}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <div className="hidden flex-1 sm:block">
                <p className={`text-xs font-medium ${index <= currentStep ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <div
                  className={`mt-1 h-1 rounded-full transition-all duration-500 ${index < currentStep
                    ? 'bg-emerald-600'
                    : index === currentStep
                      ? 'bg-emerald-200'
                      : 'bg-gray-200'
                    }`}
                />
              </div>
              {index < STEPS.length - 1 && (
                <ChevronRight className="hidden h-4 w-4 text-gray-300 sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* ─── Main Content ────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ─── Form Area ────────────────────────────────────── */}
          <div className="rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* ─── Navigation Buttons ─────────────────────────── */}
            {currentStep < 2 && (
              <div
                className={`mt-8 flex gap-4 ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}
              >
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    পিছনে
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-2.5 font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:scale-105 hover:shadow-xl disabled:opacity-50"
                >
                  {currentStep === 1 ? (
                    isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        অর্ডার হচ্ছে...
                      </>
                    ) : (
                      <>
                        অর্ডার নিশ্চিত করুন
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )
                  ) : (
                    <>
                      পরবর্তী
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ─── Order Summary (Sidebar) ────────────────────────── */}
          <div className="sticky top-24 h-fit rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg">
            <h3 className="border-b border-amber-200/30 pb-3 font-serif text-lg font-bold text-[#174D3B]">
              অর্ডার সারাংশ
            </h3>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <img
                    src={item.image || '/default-book.jpg'}
                    alt={item.title}
                    className="h-14 w-12 rounded border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-[#174D3B]">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ৳{item.price}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="space-y-1.5 border-t border-amber-200/30 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">সাবটোটাল</span>
                  <span className="font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ডেলিভারি</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'ফ্রি' : `৳${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-amber-200/30 pt-2 text-lg font-bold">
                  <span className="text-[#174D3B]">মোট</span>
                  <span className="text-emerald-700">৳{grandTotal}</span>
                </div>
                {shippingCost === 0 && subtotal > 0 && (
                  <p className="text-xs text-emerald-600">✓ ফ্রি ডেলিভারি</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

// ────────────────────────────────────────────────────────────────
// ─── Step 1: Address ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────

const AddressStep = ({
  formData,
  errors,
  onChange,
  sameAsBilling,
  onToggle,
  districts,
}) => {
  const renderAddressFields = (prefix) => {
    const data = formData[prefix];
    const err = errors[prefix] || {};

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name={`${prefix}.fullName`}
                value={data.fullName || ''}
                onChange={onChange}
                className={`w-full rounded-lg border ${err.fullName ? 'border-red-500' : 'border-gray-200'
                  } pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
                placeholder="আপনার নাম"
              />
            </div>
            {err.fullName && <p className="mt-1 text-xs text-red-500">{err.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name={`${prefix}.email`}
                value={data.email || ''}
                onChange={onChange}
                className={`w-full rounded-lg border ${err.email ? 'border-red-500' : 'border-gray-200'
                  } pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
                placeholder="your@email.com"
              />
            </div>
            {err.email && <p className="mt-1 text-xs text-red-500">{err.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ফোন নম্বর <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name={`${prefix}.phone`}
              value={data.phone || ''}
              onChange={onChange}
              className={`w-full rounded-lg border ${err.phone ? 'border-red-500' : 'border-gray-200'
                } pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
              placeholder="018XXXXXXXX"
            />
          </div>
          {err.phone && <p className="mt-1 text-xs text-red-500">{err.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ঠিকানা <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Home className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <textarea
              name={`${prefix}.address`}
              rows={2}
              value={data.address || ''}
              onChange={onChange}
              className={`w-full rounded-lg border ${err.address ? 'border-red-500' : 'border-gray-200'
                } pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
              placeholder="আপনার সম্পূর্ণ ঠিকানা"
            />
          </div>
          {err.address && <p className="mt-1 text-xs text-red-500">{err.address}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              জেলা <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                name={`${prefix}.district`}
                value={data.district || ''}
                onChange={onChange}
                className={`w-full rounded-lg border ${err.district ? 'border-red-500' : 'border-gray-200'
                  } appearance-none bg-white pl-10 pr-8 py-2.5 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
              >
                <option value="">জেলা নির্বাচন করুন</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {err.district && <p className="mt-1 text-xs text-red-500">{err.district}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              পোস্ট কোড <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name={`${prefix}.postCode`}
                value={data.postCode || ''}
                onChange={onChange}
                className={`w-full rounded-lg border ${err.postCode ? 'border-red-500' : 'border-gray-200'
                  } pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
                placeholder="ম্যানুয়ালি লিখুন"
              />
            </div>
            {err.postCode && <p className="mt-1 text-xs text-red-500">{err.postCode}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ─── Toggle: Same as Billing ────────────────────────── */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
        <input
          type="checkbox"
          id="sameAsBilling"
          checked={sameAsBilling}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="sameAsBilling" className="cursor-pointer text-sm font-medium text-gray-700">
          ডেলিভারি ঠিকানা বিলিং ঠিকানার মতোই
        </label>
      </div>

      {/* ─── Billing Address ────────────────────────────────── */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#174D3B]">
          <User className="h-5 w-5 text-emerald-600" />
          বিলিং ঠিকানা
        </h4>
        {renderAddressFields('billing')}
      </div>

      {/* ─── Shipping Address ────────────────────────────────── */}
      {!sameAsBilling && (
        <div className="border-t border-amber-200/30 pt-4">
          <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#174D3B]">
            <Truck className="h-5 w-5 text-amber-600" />
            ডেলিভারি ঠিকানা
          </h4>
          {renderAddressFields('shipping')}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// ─── Step 2: Payment ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────

const PaymentStep = ({ formData, onChange }) => {
  const paymentMethods = [
    {
      id: 'cod',
      label: 'হাতে-নগদ (COD)',
      icon: Wallet,
      description: 'পণ্য হাতে পেয়ে টাকা পরিশোধ',
    },
    {
      id: 'bkash',
      label: 'bKash',
      icon: CreditCard,
      description: 'bKash মোবাইল ব্যাংকিং',
    },
    {
      id: 'sslcommerz',
      label: 'SSLCommerz',
      icon: Shield,
      description: 'ডেবিট/ক্রেডিট কার্ড, অনলাইন ব্যাংকিং',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${formData.paymentMethod === method.id
              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
              : 'border-gray-200 hover:border-emerald-200'
              }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={formData.paymentMethod === method.id}
              onChange={onChange}
              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <method.icon className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-[#174D3B]">{method.label}</span>
              </div>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
        <div className="flex items-start gap-2 text-sm text-emerald-800">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            অর্ডার নিশ্চিত হওয়ার পর আপনি আপনার ইমেইল এবং ফোনে একটি কনফার্মেশন বার্তা পাবেন।
          </p>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// ─── Step 3: Confirmation (Full Cash Memo) ────────────────────
// ────────────────────────────────────────────────────────────────

const ConfirmationStep = ({
  orderNumber,
  items,
  billingAddress,
  shippingAddress,
  subtotal,
  shippingCost,
  grandTotal,
  paymentMethod,
  orderNotes,
}) => {
  const isSavedRef = useRef(false);

  const orderDate = new Date().toLocaleString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentMethodLabels = {
    cod: 'হাতে-নগদ (COD)',
    bkash: 'bKash',
    sslcommerz: 'SSLCommerz',
  };

  // POST Order to DB on Mount
  useEffect(() => {
    if (!orderNumber || isSavedRef.current) return;

    const saveOrderToDB = async () => {
      try {
        const orderData = {
          orderNumber,
          orderDate,
          items,
          billingAddress,
          shippingAddress,
          subtotal,
          shippingCost,
          grandTotal,
          paymentMethod,
          orderNotes,
          status: 'Pending',
        };

        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Failed to save order to database');
        }

        isSavedRef.current = true;
      } catch (error) {
        console.error('Error storing order in DB:', error);
      }
    };

    saveOrderToDB();
  }, [
    orderNumber,
    orderDate,
    items,
    billingAddress,
    shippingAddress,
    subtotal,
    shippingCost,
    grandTotal,
    paymentMethod,
    orderNotes,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const hasData = items && items.length > 0;

  return (
    <div className="space-y-6">
      {/* ─── Success Header ───────────────────────────────────── */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#174D3B]">অর্ডার সম্পন্ন হয়েছে!</h2>
        <p className="mt-1 text-gray-500">আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে।</p>
      </div>

      {/* ─── Order Summary Card ─────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg print:shadow-none md:p-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-amber-200/30 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#174D3B]">
                ধাওয়া পাবলিকেশন
              </h3>
              <p className="text-xs text-gray-400">ইসলামিক বইয়ের দোকান</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#174D3B]">অর্ডার নম্বর</p>
              <p className="text-lg font-bold text-emerald-700">{orderNumber || 'N/A'}</p>
              <p className="text-xs text-gray-400">{orderDate}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 gap-4 border-b border-amber-200/30 pb-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                বিলিং ঠিকানা
              </p>
              {billingAddress ? (
                <>
                  <p className="font-medium text-[#174D3B]">{billingAddress.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{billingAddress.address || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    {billingAddress.district || 'N/A'}, {billingAddress.postCode || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{billingAddress.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{billingAddress.email || 'N/A'}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">ঠিকানা পাওয়া যায়নি</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                ডেলিভারি ঠিকানা
              </p>
              {shippingAddress ? (
                <>
                  <p className="font-medium text-[#174D3B]">{shippingAddress.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{shippingAddress.address || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    {shippingAddress.district || 'N/A'}, {shippingAddress.postCode || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{shippingAddress.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{shippingAddress.email || 'N/A'}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">বিলিং ঠিকানার মতোই</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-b border-amber-200/30 pb-4">
            <div className="flex flex-wrap items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                পেমেন্ট পদ্ধতি
              </span>
              <span className="font-medium text-[#174D3B]">
                {paymentMethodLabels[paymentMethod] || paymentMethod || 'N/A'}
              </span>
            </div>
            {orderNotes && (
              <div className="mt-1 flex flex-wrap items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  অর্ডার নোট
                </span>
                <span className="text-sm text-gray-600">{orderNotes}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-b border-amber-200/30 pb-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              অর্ডারকৃত আইটেমসমূহ
            </h4>
            {hasData ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || '/default-book.jpg'}
                      alt={item.title}
                      className="h-16 w-12 rounded border object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#174D3B]">{item.title || 'N/A'}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity || 1} × ৳{item.price || 0}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-700">
                      ৳{(item.price || 0) * (item.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">কোনো আইটেম পাওয়া যায়নি</p>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">সাবটোটাল</span>
              <span className="font-medium">৳{subtotal || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ডেলিভারি চার্জ</span>
              <span className="font-medium">
                {shippingCost === 0 ? 'ফ্রি' : `৳${shippingCost || 0}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-amber-200/30 pt-2 text-base font-bold">
              <span className="text-[#174D3B]">মোট</span>
              <span className="text-emerald-700">৳{grandTotal || 0}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="no-print flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/"
              className="rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-2.5 font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:scale-105 hover:shadow-xl"
            >
              হোমপেজে যান
            </Link>
            <Link
              to="/account/orders"
              className="rounded-full border border-emerald-600 px-8 py-2.5 font-semibold text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
            >
              অর্ডার ট্র্যাক করুন
            </Link>
            <button
              onClick={handlePrint}
              className="rounded-full border border-gray-300 px-8 py-2.5 font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              🖨️ প্রিন্ট রিসিপ্ট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
