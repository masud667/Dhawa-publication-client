import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

import AddToCartButton from '../../Shared/AddToCartButton';

const DEFAULT_IMAGE = '/default-book.jpg';

export const BookCard = ({ book }) => {
  const [imageSrc, setImageSrc] = useState(
    book?.image || DEFAULT_IMAGE
  );

  const regularPrice = Number(book?.price) || 0;
  const salePrice = Number(book?.discountPrice) || 0;

  const hasDiscount =
    salePrice > 0 && salePrice < regularPrice;

  const discount = hasDiscount
    ? Math.round(
        ((regularPrice - salePrice) / regularPrice) * 100
      )
    : 0;

  const rating = Number(book?.rating) || 0;

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Add wishlist functionality here later
    console.log('Wishlist:', book);
  };

  return (
    <motion.article
      whileHover={{
        y: -8,
        boxShadow: '0 24px 45px -20px rgba(20, 83, 45, 0.35)',
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-md
        transition-all
        duration-300
        hover:border-emerald-200
        hover:shadow-xl
      "
    >
      {/* =====================================================
          BOOK DETAILS LINK
      ====================================================== */}

      <Link
        to={`/books/${book?._id}`}
        className="block flex-1"
      >
        {/* Discount badge */}
        {discount > 0 && (
          <span
            className="
              absolute
              left-3
              top-3
              z-20
              rounded-full
              bg-gradient-to-r
              from-rose-500
              to-red-500
              px-3
              py-1.5
              text-xs
              font-bold
              text-white
              shadow-lg
            "
          >
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="
            absolute
            right-3
            top-3
            z-30
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-white/85
            shadow-md
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-110
            hover:bg-white
          "
          aria-label="Add to wishlist"
        >
          <Heart
            className="
              h-4
              w-4
              text-gray-500
              transition-colors
              duration-200
              hover:text-rose-500
            "
          />
        </button>

        {/* =================================================
            BOOK IMAGE
        ================================================== */}

        <div
          className="
            relative
            aspect-[3/4]
            w-full
            overflow-hidden
            bg-[#f4f1e9]
          "
        >
          <img
            src={imageSrc}
            alt={book?.title || 'Book cover'}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
            loading="lazy"
            onError={() => {
              if (imageSrc !== DEFAULT_IMAGE) {
                setImageSrc(DEFAULT_IMAGE);
              }
            }}
          />

          {/* Image bottom gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/15
              via-transparent
              to-transparent
            "
          />

          {/* Hover dark overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-emerald-950/0
              transition-colors
              duration-500
              group-hover:bg-emerald-950/10
            "
          />
        </div>

        {/* =================================================
            BOOK INFORMATION
        ================================================== */}

        <div className="p-4">
          {/* Category */}
          <p
            className="
              mb-1.5
              truncate
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-emerald-700
            "
          >
            {book?.category || 'বই'}
          </p>

          {/* Title */}
          <h3
            className="
              min-h-[44px]
              font-serif
              text-[15px]
              font-bold
              leading-snug
              text-gray-800
              transition-colors
              duration-300
              line-clamp-2
              group-hover:text-emerald-800
            "
          >
            {book?.title || 'বইয়ের নাম পাওয়া যায়নি'}
          </h3>

          {/* Author */}
          <p
            className="
              mt-1
              truncate
              text-xs
              text-gray-500
            "
          >
            {book?.author || 'লেখকের নাম পাওয়া যায়নি'}
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((index) => (
                <Star
                  key={index}
                  className={`
                    h-3.5
                    w-3.5
                    ${
                      index < Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-transparent text-gray-300'
                    }
                  `}
                />
              ))}
            </div>

            {rating > 0 && (
              <span className="ml-1 text-[11px] text-gray-500">
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-lg font-bold text-emerald-700">
              ৳{hasDiscount ? salePrice : regularPrice}
            </span>

            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ৳{regularPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* =====================================================
          ADD TO CART
          Outside Link so clicking does not open details page
      ====================================================== */}

      <div
        className="
          px-4
          pb-4

          opacity-100
          translate-y-0

          md:max-h-0
          md:overflow-hidden
          md:pb-0
          md:opacity-0
          md:translate-y-3

          md:transition-all
          md:duration-300

          md:group-hover:max-h-20
          md:group-hover:pb-4
          md:group-hover:opacity-100
          md:group-hover:translate-y-0
        "
      >
        <AddToCartButton
          product={{
            id: book?._id,
            _id: book?._id,
            title: book?.title,
            price: hasDiscount
              ? salePrice
              : regularPrice,
            image: book?.image || DEFAULT_IMAGE,
          }}
          quantity={1}
          size="sm"
          variant="green"
          label="কার্টে যোগ করুন"
          className="w-full"
        />
      </div>

      {/* Decorative corner */}
      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-9
          w-9
          rounded-bl-2xl
          border-b
          border-l
          border-amber-200/50
        "
      />
    </motion.article>
  );
};