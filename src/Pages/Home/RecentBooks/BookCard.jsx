import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const DEFAULT_IMAGE = '/default-book.jpg';

export const BookCard = ({ book }) => {
  const [imageSrc, setImageSrc] = useState(book.image || DEFAULT_IMAGE);
  const discount = book.discountPrice
    ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
    : 0;

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-transparent hover:border-amber-200/50 transition-all duration-300"
    >
      <Link to={`/books/${book._id}`} className="block h-full">
        {/* ─── Discount Badge ────────────────────────── */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}

        {/* ─── Wishlist Button ───────────────────────── */}
        <button
          onClick={handleIconClick}
          className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200 border border-white/20"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-gray-500 hover:text-rose-500 transition-colors" />
        </button>

        {/* ─── Cover ──────────────────────────────────── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-t-2xl">
          <img
            src={imageSrc}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageSrc(DEFAULT_IMAGE)}
          />
          {/* Subtle inner shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        </div>

        {/* ─── Content ────────────────────────────────── */}
        <div className="p-4 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium">
            {book.category}
          </p>
          <h3 className="font-serif text-base font-semibold text-gray-800 line-clamp-2 leading-snug">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(book.rating) ? 'fill-current' : 'fill-none text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 pt-1">
            {book.discountPrice ? (
              <>
                <span className="text-lg font-bold text-emerald-700">৳{book.discountPrice}</span>
                <span className="text-sm text-gray-400 line-through">৳{book.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-emerald-700">৳{book.price}</span>
            )}
          </div>

          {/* ─── Hover Overlay ────────────────────────── */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Added "${book.title}" to cart`);
              }}
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-medium py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* ─── Decorative corner accent ────────────── */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-200/30 rounded-tr-2xl pointer-events-none" />
      </Link>
    </motion.div>
  );
};