// src/Pages/Checkout/Checkout.jsx
import React, { useState, useEffect } from 'react';
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
import api from '../api/axios'; // axios instance

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

  // ব্যাকআপ রাখার জন্য যেন শেষ ধাপে টোটাল ভ্যালু হারিয়ে না যায়
  const [finalOrderSummary, setFinalOrderSummary] = useState({
    items: [],
    subtotal: 0,
    shippingCost: 0,
    grandTotal: 0
  });

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

  // ─── Dynamic Shipping Cost Logic (Dhaka: 60, Outside: 110) ─────
  const activeDistrict = sameAsBilling ? formData.billing.district : formData.shipping.district;
  const isDhaka = activeDistrict === 'ঢাকা';
  const subtotal = totalPrice;
  const shippingCost = isDhaka ? 60 : 110;
  const grandTotal = subtotal + shippingCost;

  // শেষ ধাপে কার্ট খালি হয়ে গেলেও যেন ব্যাকআপ ডাটা থেকে দেখায়
  const displayItems = currentStep === 2 && finalOrderSummary.items.length > 0 ? finalOrderSummary.items : items;
  const displaySubtotal = currentStep === 2 && finalOrderSummary.subtotal > 0 ? finalOrderSummary.subtotal : subtotal;
  const displayShippingCost = currentStep === 2 && finalOrderSummary.shippingCost > 0 ? finalOrderSummary.shippingCost : shippingCost;
  const displayGrandTotal = currentStep === 2 && finalOrderSummary.grandTotal > 0 ? finalOrderSummary.grandTotal : grandTotal;

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
        if (errors[prefix]?.[field]) {
          setErrors((prev) => ({
            ...prev,
            [prefix]: { ...prev[prefix], [field]: '' },
          }));
        }
        return;
      }
    }

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
      if (currentStep === 1) {
        handleSubmitOrder();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // ─── Submit Order to Database ──────────────────────────────────
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    // কার্ট ক্লিয়ার হওয়ার আগেই মানগুলো ব্যাকআপ করে রাখছি
    setFinalOrderSummary({
      items: [...items],
      subtotal,
      shippingCost,
      grandTotal,
    });

    const shippingData = sameAsBilling ? formData.billing : formData.shipping;

    const orderPayload = {
      email: formData.billing.email,
      billing: formData.billing,
      shipping: shippingData,
      shippingLocation: isDhaka ? 'inside_dhaka' : 'outside_dhaka',
      orderNotes: formData.orderNotes,
      paymentMethod: formData.paymentMethod,
      orderItems: items.map((item) => ({
        bookId: item.id || item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
      })),
      subtotal: subtotal,
      shippingCost: shippingCost,
      totalAmount: grandTotal,
      status: 'pending',
    };

    try {
      const { data } = await api.post('/orders', orderPayload);

      if (data.success || data.orderId) {
        const createdId = data.orderId || data.order?._id;
        setOrderNumber(createdId);
        clearCart(); // কার্ট খালি করে দিচ্ছে
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert(error.response?.data?.message || 'অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            grandTotal={displayGrandTotal}
            shippingCost={displayShippingCost}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12 text-gray-800">
      <div className="container relative z-10 mx-auto max-w-[1100px] px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#174D3B] md:text-4xl">
              চেকআউট
            </h1>
            <p className="mt-1 text-sm text-gray-600">আপনার অর্ডার সম্পন্ন করুন</p>
          </div>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            কার্টে ফিরে যান
          </Link>
        </div>

        {/* Steps */}
        <div className="mb-10 flex items-center justify-between gap-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${index < currentStep
                    ? 'bg-emerald-600 text-white'
                    : index === currentStep
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <div className="hidden flex-1 sm:block">
                <p className={`text-xs font-medium ${index <= currentStep ? 'text-emerald-700' : 'text-gray-500'}`}>
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
                <ChevronRight className="hidden h-4 w-4 text-gray-400 sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
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

            {currentStep < 2 && (
              <div
                className={`mt-8 flex gap-4 ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}
              >
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
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
                    isSubmitting ? 'অর্ডার হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'
                  ) : (
                    'পরবর্তী'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="sticky top-24 h-fit rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg">
            <h3 className="border-b border-amber-200/30 pb-3 font-serif text-lg font-bold text-[#174D3B]">
              অর্ডার সারাংশ
            </h3>
            <div className="mt-4 space-y-3">
              {displayItems.map((item) => (
                <div key={item.id || item._id} className="flex items-start gap-3">
                  <img
                    src={item.image || '/default-book.jpg'}
                    alt={item.title}
                    className="h-14 w-12 rounded border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-[#174D3B]">{item.title}</p>
                    <p className="text-xs text-gray-600">
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
                  <span className="text-gray-700">সাবটোটাল</span>
                  <span className="font-medium text-gray-900">৳{displaySubtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">ডেলিভারি</span>
                  <span className="font-medium text-gray-900">৳{displayShippingCost}</span>
                </div>
                <div className="flex justify-between border-t border-amber-200/30 pt-2 text-lg font-bold">
                  <span className="text-[#174D3B]">মোট</span>
                  <span className="text-emerald-700">৳{displayGrandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

// Address Step Component
const AddressStep = ({ formData, errors, onChange, sameAsBilling, onToggle, districts }) => {
  const renderAddressFields = (prefix) => {
    const data = formData[prefix];
    const err = errors[prefix] || {};

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800">পূর্ণ নাম <span className="text-red-500">*</span></label>
            <input
              type="text"
              name={`${prefix}.fullName`}
              value={data.fullName || ''}
              onChange={onChange}
              className={`w-full rounded-lg border ${err.fullName ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
              placeholder="আপনার নাম"
            />
            {err.fullName && <p className="mt-1 text-xs text-red-500">{err.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">ইমেইল <span className="text-red-500">*</span></label>
            <input
              type="email"
              name={`${prefix}.email`}
              value={data.email || ''}
              onChange={onChange}
              className={`w-full rounded-lg border ${err.email ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
              placeholder="your@email.com"
            />
            {err.email && <p className="mt-1 text-xs text-red-500">{err.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">ফোন নম্বর <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name={`${prefix}.phone`}
            value={data.phone || ''}
            onChange={onChange}
            className={`w-full rounded-lg border ${err.phone ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
            placeholder="018XXXXXXXX"
          />
          {err.phone && <p className="mt-1 text-xs text-red-500">{err.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">ঠিকানা <span className="text-red-500">*</span></label>
          <textarea
            name={`${prefix}.address`}
            rows={2}
            value={data.address || ''}
            onChange={onChange}
            className={`w-full rounded-lg border ${err.address ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
            placeholder="আপনার সম্পূর্ণ ঠিকানা"
          />
          {err.address && <p className="mt-1 text-xs text-red-500">{err.address}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800">জেলা <span className="text-red-500">*</span></label>
            <select
              name={`${prefix}.district`}
              value={data.district || ''}
              onChange={onChange}
              className={`w-full rounded-lg border ${err.district ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {err.district && <p className="mt-1 text-xs text-red-500">{err.district}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">পোস্ট কোড <span className="text-red-500">*</span></label>
            <input
              type="text"
              name={`${prefix}.postCode`}
              value={data.postCode || ''}
              onChange={onChange}
              className={`w-full rounded-lg border ${err.postCode ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
              placeholder="1200"
            />
            {err.postCode && <p className="mt-1 text-xs text-red-500">{err.postCode}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-bold text-[#174D3B]">বিলিং ঠিকানা</h2>
      {renderAddressFields('billing')}

      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium text-gray-800">শিপিং ঠিকানা এবং বিলিং ঠিকানা একই</span>
        </label>
      </div>

      {!sameAsBilling && (
        <div className="space-y-6 border-t border-amber-200/30 pt-6">
          <h2 className="font-serif text-xl font-bold text-[#174D3B]">শিপিং ঠিকানা</h2>
          {renderAddressFields('shipping')}
        </div>
      )}
    </div>
  );
};

// Payment Step Component
const PaymentStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="font-serif text-xl font-bold text-[#174D3B]">পেমেন্ট পদ্ধতি</h2>
    <label className="flex items-center justify-between rounded-xl border border-emerald-600 bg-emerald-50/50 p-4 cursor-pointer">
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          checked={formData.paymentMethod === 'cod'}
          onChange={onChange}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
        />
        <div>
          <p className="font-semibold text-gray-900">ক্যাশ অন ডেলিভারি (COD)</p>
          <p className="text-xs text-gray-600">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
        </div>
      </div>
      <Wallet className="h-6 w-6 text-emerald-600" />
    </label>

    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">অর্ডার নোট (ঐচ্ছিক)</label>
      <textarea
        name="orderNotes"
        rows={3}
        value={formData.orderNotes || ''}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        placeholder="ডেলিভারি সম্পর্কিত কোনো বিশেষ নির্দেশ থাকলে লিখুন..."
      />
    </div>
  </div>
);

// Confirmation Step Component
const ConfirmationStep = ({ orderNumber, grandTotal, shippingCost }) => (
  <div className="py-8 text-center space-y-4">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
      <Check className="h-8 w-8" />
    </div>
    <h2 className="text-2xl font-bold text-emerald-900">আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h2>
    <p className="text-sm text-gray-700">
      অর্ডার আইডি: <span className="font-mono font-bold text-gray-900">{orderNumber || 'N/A'}</span>
    </p>
    <p className="text-sm text-gray-700">
      সর্বমোট মূল্য: <span className="font-bold text-emerald-700">৳{grandTotal || 0}</span>
      <span className="text-xs text-gray-500 block mt-1">(ডেলিভারি চার্জ অন্তর্ভুক্ত: ৳{shippingCost || 0})</span>
    </p>
    <div className="pt-4">
      <Link
        to="/books"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-700/30 transition hover:bg-emerald-800"
      >
        আরও বই ব্রাউজ করুন
      </Link>
    </div>
  </div>
);