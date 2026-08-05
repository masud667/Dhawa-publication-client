import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

const AddToCartButton = ({
  product,
  quantity = 1,
  className = '',
  variant = 'primary',
  showIcon = true,
  label = 'কার্টে যোগ করুন',
  successLabel = 'যোগ হয়েছে',
  loadingLabel = 'যোগ হচ্ছে...',
  onSuccess = () => {},
  disabled = false,
  size = 'default', // 'sm' | 'default' | 'lg'
}) => {
  const addToCart = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (isAdding || disabled) return;
    setIsAdding(true);

    // Add to cart
    addToCart({
      id: product.id || product._id,
      title: product.title,
      price: product.discountPrice || product.price || 0,
      quantity: quantity,
      image: product.image || product.cover || '',
    });

    // Show success state
    setIsAdded(true);
    onSuccess();

    // Reset after 1.5s
    setTimeout(() => {
      setIsAdded(false);
      setIsAdding(false);
    }, 1500);
  };

  // ─── Variant styles ───────────────────────────
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-lg shadow-emerald-700/30 hover:shadow-xl disabled:opacity-50',
    outline: 'border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white',
    green: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md',
    gold: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30 hover:shadow-xl disabled:opacity-50',
  };

  // ─── Size styles ──────────────────────────────
  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    default: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base h-12',
  };

  return (
    <motion.button
      type="button"
      disabled={disabled || isAdding}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> {successLabel}
          </motion.span>
        ) : isAdding ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {loadingLabel}
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {showIcon && <ShoppingCart className="h-4 w-4" />}
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* ─── Ripple effect ────────────────────────── */}
      {isAdding && !isAdded && (
        <motion.span
          className="absolute inset-0 rounded-full bg-white/20"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default AddToCartButton;