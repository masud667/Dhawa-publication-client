import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  BookOpen,
  UserRound,
  Building2,
  Tags,
  Package,
  Hash,
  ArrowLeft,
  Heart,
  Share2,
  Star,
  StarHalf,
  Send,
  Clock,
  Check,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCartStore } from '../../store/cartStore';

import { BookCard } from './RecentBooks/BookCard'; // adjust path
import { AddToCartButton } from '../Shared';
import axios from 'axios';
import api from '../../api/axios';

const FALLBACK_IMAGE =
  'https://placehold.co/600x850/F4F0E8/174D3B?text=Dhawa+Publication';

// ─── Sample Review Data (replace with API later) ──────────
const sampleReviews = [
  {
    id: 1,
    name: 'আব্দুল্লাহ আল-মামুন',
    rating: 5,
    comment: 'অসাধারণ একটি বই! ভাষা সহজ এবং বিষয়বস্তু অত্যন্ত সমৃদ্ধ। প্রতিটি অধ্যায় পড়ার পর নতুন কিছু শিখতে পারলাম।',
    date: '১৫ আগস্ট, ২০২৬',
    avatar: 'https://ui-avatars.com/api/?name=আব্দুল্লাহ&background=174D3B&color=fff&size=40',
  },
  {
    id: 2,
    name: 'নাদিয়া খাতুন',
    rating: 4,
    comment: 'বইটি ভালো লাগলো, তবে কিছু জায়গায় আরও বিস্তারিত আশা করেছিলাম। তবুও সামগ্রিকভাবে উপভোগ্য।',
    date: '১০ আগস্ট, ২০২৬',
    avatar: 'https://ui-avatars.com/api/?name=নাদিয়া&background=8B681D&color=fff&size=40',
  },
  {
    id: 3,
    name: 'মো. হাসান',
    rating: 5,
    comment: 'এটি আমার পড়া সেরা ইসলামিক বইগুলোর মধ্যে একটি। লেখকের চিন্তাধারা অসাধারণ এবং উপস্থাপনা দারুণ।',
    date: '৫ আগস্ট, ২০২৬',
    avatar: 'https://ui-avatars.com/api/?name=হাসান&background=2D6A55&color=fff&size=40',
  },
];

export const BookDetails = () => {
  const { id } = useParams();

  // ─── State ──────────────────────────────────────────────────
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  // ─── Cart state ─────────────────────────────────────────────
  const addToCart = useCartStore((state) => state.addItem);

  // ─── Modal state ────────────────────────────────────────────
  const [showPdfModal, setShowPdfModal] = useState(false);
  // ─── Fetch Book Data ──────────────────────────────────────
  useEffect(() => {
    const getBook = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await api.get(`/books/${id}`
        );
console.log(id)
        setBook(data);
      } catch (error) {
        console.error(
          'Book details error:',
          error.response?.data || error.message
        );

        setBook(null);
        setError('বইটির তথ্য পাওয়া যায়নি।');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getBook();
    }
  }, [id]);


  // ─── Buy Now (open PDF modal) ──────────────────────────────
  const handleBuyNow = () => {
    setShowPdfModal(true);
  };

  // ─── Handlers ──────────────────────────────────────────────
  const increaseQuantity = () => {
    const availableStock = Number(book?.stock) || 1;
    setQuantity((current) => (current < availableStock ? current + 1 : current));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => (current > 1 ? current - 1 : 1));
  };

  const price = Number(book?.price) || 0;
  const discountPrice = Number(book?.discountPrice) || price;
  const discountPercent = price > discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const formatPrice = (amount) => {
    return `${Number(amount).toLocaleString('en-US')}৳`;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (userRating === 0 || userReview.trim() === '') return;
    const newReview = {
      id: Date.now(),
      name: 'আপনি', // would come from auth
      rating: userRating,
      comment: userReview,
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      avatar: 'https://ui-avatars.com/api/?name=আপনি&background=174D3B&color=fff&size=40',
    };
    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setUserReview('');
    setShowReviewForm(false);
  };

  // ─── Loading State ──────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#FAF9F5] py-12">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="mb-8 h-5 w-56 animate-pulse rounded bg-[#E8E1D5]" />
          <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="mx-auto h-[440px] w-[300px] animate-pulse rounded-2xl bg-gradient-to-br from-[#E8E1D5] to-[#D5CCBE]" />
            <div className="space-y-4">
              <div className="h-12 w-3/4 animate-pulse rounded bg-[#E8E1D5]" />
              <div className="h-7 w-48 animate-pulse rounded bg-[#E8E1D5]" />
              <div className="space-y-3">
                <div className="h-4 animate-pulse rounded bg-[#E8E1D5]" />
                <div className="h-4 animate-pulse rounded bg-[#E8E1D5]" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-[#E8E1D5]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Error State ────────────────────────────────────────────
  if (error || !book) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F5] px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-emerald-100 text-5xl shadow-lg">
            📚
          </div>
          <h2 className="mt-6 font-serif text-3xl font-bold text-[#174D3B]">বই পাওয়া যায়নি</h2>
          <p className="mt-3 text-gray-500">{error}</p>
          <Link
            to="/books"
            className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-[#2D6A55] px-8 py-3 font-semibold text-[#215B47] transition hover:bg-[#215B47] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            সকল বই
          </Link>
        </div>
      </section>
    );
  }

  // ─── Main Render ────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FAF9F5]">
      {/* ─── Geometric Pattern Background ────────────────── */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bookDetailPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" stroke="#B8860B" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#B8860B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bookDetailPattern)" />
        </svg>
      </div>

      {/* ─── Breadcrumb ────────────────────────────────────── */}
      <div className="relative border-b border-amber-200/30 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-[1200px] px-4 py-5">
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 transition hover:text-[#215B47]">
              হোম
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
            <Link to="/books" className="text-gray-500 transition hover:text-[#215B47]">
              সকল বই
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
            <span className="max-w-[230px] truncate font-serif font-semibold text-[#174D3B]">
              {book.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── Main Product Area ────────────────────────────── */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="grid items-start gap-10 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">

            {/* ─── Book Image ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-full max-w-[340px]"
            >
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-[0_20px_60px_rgba(42,50,45,0.12)] transition-shadow duration-300 hover:shadow-[0_30px_80px_rgba(42,50,45,0.18)]">
                {/* ─── Decorative Border Glow ────────────── */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-emerald-500/20 to-amber-400/20 opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* ─── Discount Badge ────────────────────── */}
                {discountPercent > 0 && (
                  <div className="absolute left-5 top-5 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-sm font-bold text-white shadow-lg shadow-amber-500/30">
                    -{discountPercent}%
                  </div>
                )}

                {/* ─── Image Container ────────────────────── */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#EEE9DF]">
                  <img
                    src={book.image || FALLBACK_IMAGE}
                    alt={book.title || 'Book cover'}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* ─── Hover Overlay ────────────────────── */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/0 opacity-0 transition-all duration-400 group-hover:bg-black/20 group-hover:opacity-100">
                    <button className="rounded-full bg-white/90 p-3 shadow-lg transition hover:scale-110">
                      <Heart className="h-5 w-5 text-rose-500" />
                    </button>
                    <button className="rounded-full bg-white/90 p-3 shadow-lg transition hover:scale-110">
                      <Share2 className="h-5 w-5 text-emerald-600" />
                    </button>
                  </div>
                </div>

                {/* ─── Corner Decorations ────────────────── */}
                <div className="absolute bottom-3 right-3 text-amber-300/30 text-sm">✦</div>
                <div className="absolute top-3 left-3 text-amber-300/30 text-sm">✦</div>
              </div>
            </motion.div>

            {/* ─── Book Information ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* ─── Category ────────────────────────────── */}
              {book.section && (
                <p className="mb-2 text-xs font-bold tracking-[0.15em] text-amber-600 uppercase">
                  {book.section}
                </p>
              )}

              {/* ─── Title ────────────────────────────────── */}
              <h1 className="border-b border-amber-200/40 pb-5 font-serif text-3xl font-bold leading-tight text-[#263D35] md:text-4xl lg:text-5xl">
                {book.title}
                <span className="mt-2 block h-0.5 w-16 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
              </h1>

              {/* ─── Author ───────────────────────────────── */}
              {book.author && (
                <p className="mt-3 text-sm font-medium text-[#5D655F]">
                  <span className="text-amber-600">লেখক:</span> {book.author}
                </p>
              )}

              {/* ─── Price ────────────────────────────────── */}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {price > discountPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(price)}</span>
                )}
                <span className="text-3xl font-bold text-emerald-700">{formatPrice(discountPrice)}</span>
                {discountPercent > 0 && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    {discountPercent}% ছাড়
                  </span>
                )}
              </div>

              {/* ─── Short Description ────────────────────── */}
              {book.description && (
                <div className="mt-5 border-b border-amber-200/30 pb-5">
                  <p className="text-[15px] leading-8 text-[#5D655F] line-clamp-3">
                    {book.description}
                  </p>
                </div>
              )}

              {/* ─── Book Info Grid ───────────────────────── */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-amber-200/30 shadow-sm">
                <DetailRow
                  icon={<UserRound className="h-4 w-4" />}
                  label="লেখক"
                  value={book.author}
                />
                <DetailRow
                  icon={<BookOpen className="h-4 w-4" />}
                  label="বিষয়"
                  value={book.category || book.section}
                />
                <DetailRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="প্রকাশক"
                  value={book.publisher}
                />
                <DetailRow
                  icon={<Tags className="h-4 w-4" />}
                  label="বিভাগ"
                  value={book.section}
                />
                <DetailRow
                  icon={<Package className="h-4 w-4" />}
                  label="স্টক"
                  value={Number(book.stock) > 0 ? `${book.stock} টি` : 'স্টক নেই'}
                />
                {book.isbn && (
                  <DetailRow
                    icon={<Hash className="h-4 w-4" />}
                    label="ISBN"
                    value={book.isbn}
                    isLast
                  />
                )}
              </div>

              {/* ─── Quantity + Cart ──────────────────────── */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {/* ─── Quantity Selector ────────────────── */}
                <div className="flex h-12 items-center rounded-full border border-amber-200/50 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="flex h-full w-11 items-center justify-center rounded-l-full text-gray-500 transition hover:bg-amber-50 hover:text-[#174D3B]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-full min-w-12 items-center justify-center px-3 font-semibold text-[#263D35]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="flex h-full w-11 items-center justify-center rounded-r-full text-gray-500 transition hover:bg-amber-50 hover:text-[#174D3B]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* ─── Reusable Add to Cart Button ────────────────── */}
                <AddToCartButton
                  product={{
                    id: book._id,
                    title: book.title,
                    price: discountPrice,
                    image: book.image,
                  }}
                  quantity={quantity}
                  disabled={Number(book.stock) <= 0}
                  size="lg"
                  variant="primary"
                  label="কার্টে যোগ করুন"
                  className="px-8"
                />

                {/* ─── Buy Now ────────────────────────────────────────── */}
                <button
                  type="button"
                  disabled={Number(book.stock) <= 0}
                  onClick={handleBuyNow}
                  className="inline-flex h-12 items-center justify-center rounded-full border-2 border-amber-600 bg-transparent px-8 text-sm font-bold text-amber-600 transition hover:bg-amber-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                >
                  এখনই নমুনা পড়ুন
                </button>
              </div>
              {/* ─── Stock Note ───────────────────────────── */}
              {Number(book.stock) > 0 && (
                <p className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  বইটি বর্তমানে স্টকে রয়েছে
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Reviews Section ────────────────────────────────── */}
      <section className="border-t border-amber-200/30 bg-white/80 py-16">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="max-w-4xl mx-auto">
            {/* ─── Section Header ────────────────────────── */}
            <div className="mb-8 flex items-center gap-4">
              <h2 className="whitespace-nowrap font-serif text-3xl font-bold text-[#174D3B]">
                গ্রাহক রিভিউ
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
              <span className="text-amber-300/40 text-xl">◈</span>
            </div>

            {/* ─── Average Rating Summary ────────────────── */}
            <div className="mb-8 flex flex-wrap items-center gap-6 rounded-2xl bg-gradient-to-br from-amber-50/50 to-emerald-50/50 p-6 border border-amber-200/30">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-[#174D3B]">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'fill-current' : 'fill-none text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{reviews.length}টি রিভিউ</span>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="ml-auto rounded-full bg-emerald-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                {showReviewForm ? 'বন্ধ করুন' : 'রিভিউ লিখুন'}
              </button>
            </div>

            {/* ─── Review Form ────────────────────────────── */}
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg"
              >
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার রেটিং</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="focus:outline-none transition hover:scale-110"
                        >
                          <Star className={`h-8 w-8 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার মতামত</label>
                    <textarea
                      rows={4}
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      placeholder="বইটি সম্পর্কে আপনার অনুভূতি শেয়ার করুন..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={userRating === 0 || userReview.trim() === ''}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-2.5 font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    রিভিউ প্রকাশ করুন
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── Reviews List ────────────────────────────── */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-amber-200/30 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=174D3B&color=fff&size=40`}
                        alt={review.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-semibold text-[#174D3B]">{review.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            {review.date}
                          </div>
                        </div>
                        <div className="mt-1 flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'fill-none text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="mt-2 text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related Books Section ──────────────────────────── */}
      {book && <RelatedBooks book={book} />}

      {/* ─── Description Section ────────────────────────────── */}
      <section className="relative border-t border-amber-200/30 bg-gradient-to-b from-[#F1EDE5] to-[#FAF9F5] py-16">
        {/* ─── Decorative Pattern ────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="descPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0 L40 20 L20 40 L0 20 Z" stroke="#B8860B" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#descPattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-[1200px] px-4">
          <div className="max-w-4xl">
            {/* ─── Section Header ────────────────────────── */}
            <div className="mb-8 flex items-center gap-4">
              <h2 className="whitespace-nowrap font-serif text-3xl font-bold text-[#174D3B]">
                বই সম্পর্কে
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
              <span className="text-amber-300/40 text-xl">◈</span>
            </div>

            {/* ─── Description Content ────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border-l-4 border-amber-500 bg-white p-8 shadow-lg md:p-10">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-50/50 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-50/50 blur-2xl" />

              <div className="relative z-10">
                <p className="whitespace-pre-line text-[15px] leading-9 text-[#59615B]">
                  {book.description || 'এই বইটির বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PDF MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowPdfModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ─── Modal Header ────────────────────────────── */}
              <div className="flex items-center justify-between border-b border-amber-200/30 bg-[#FAF9F5] px-6 py-4">
                <h3 className="font-serif text-xl font-bold text-[#174D3B]">
                  {book.title} – নমুনা পড়ুন
                </h3>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="rounded-full p-2 transition hover:bg-amber-100"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* ─── PDF Viewer ────────────────────────────────── */}
              <div className="h-[70vh] w-full bg-gray-50 p-4">
                {book.pdfUrl ? (
                  <embed
                    src={book.pdfUrl}
                    type="application/pdf"
                    className="h-full w-full rounded-lg shadow-inner"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <h4 className="text-lg font-semibold text-gray-700">নমুনা PDF উপলব্ধ নয়</h4>
                    <p className="mt-2 text-sm text-gray-500">এই বইয়ের জন্য PDF নমুনা এখনো যোগ করা হয়নি।</p>
                    <button
                      onClick={() => setShowPdfModal(false)}
                      className="mt-6 rounded-full bg-emerald-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

// ─── Detail Row Component ────────────────────────────────────
const DetailRow = ({ icon, label, value, isLast = false }) => {
  if (!value) return null;

  return (
    <div
      className={`grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)] ${!isLast ? 'border-b border-amber-200/30' : ''
        }`}
    >
      <div className="flex items-center gap-2 bg-[#F1EDE5] px-5 py-3.5 text-sm font-semibold text-[#34453D]">
        <span className="text-amber-600">{icon}</span>
        {label}
      </div>
      <div className="flex items-center bg-white px-5 py-3.5 text-sm text-[#426151]">
        {value}
      </div>
    </div>
  );
};

// ─── Related Books Component ──────────────────────────────────
const RelatedBooks = ({ book }) => {
  // ─── Mock related books – replace with API call ──────────
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Fetch Related Books ──────────────────────────────────
  useEffect(() => {
    const fetchRelated = async () => {
      if (!book?._id || !book?.category) return;

      try {
        const { data } = await api.get('/books/related',
          {
            params: {
              category: book.category,
              exclude: book._id,
            },
          }
        );

        setRelatedBooks(data);
      } catch (error) {
        console.error(
          'Error fetching related books:',
          error.response?.data || error.message
        );

        setRelatedBooks([]);
      }
    };

    fetchRelated();
  }, [book?._id, book?.category]);
  // ─── Embla Carousel Setup ──────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 640px)': { slidesToShow: 2 },
        '(min-width: 768px)': { slidesToShow: 3 },
        '(min-width: 1024px)': { slidesToShow: 4 },
        '(min-width: 1280px)': { slidesToShow: 5 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (isLoading) {
    return (
      <section className="py-16 bg-[#FAF9F5]">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="mb-8 h-8 w-48 animate-pulse rounded bg-[#E8E1D5]" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-[0_0_calc(25%-12px)]">
                <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-[#E8E1D5]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedBooks.length === 0) return null;

  return (
    <section className="py-16 bg-[#FAF9F5] border-t border-amber-200/30">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* ─── Section Header ────────────────────────────── */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="whitespace-nowrap font-serif text-3xl font-bold text-[#174D3B]">
            সম্পর্কিত বই
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
          <span className="text-amber-300/40 text-xl">◈</span>
          <Link to="/books" className="text-sm font-medium text-amber-600 hover:underline">
            সব দেখুন →
          </Link>
        </div>

        {/* ─── Carousel ────────────────────────────────────── */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {relatedBooks.map((book) => (
                <div
                  key={book._id}
                  className="min-w-0 flex-[0_0_calc(50%-10px)] sm:flex-[0_0_calc(33.333%-14px)] md:flex-[0_0_calc(25%-15px)] lg:flex-[0_0_calc(20%-16px)]"
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>



          {/* ─── Navigation Arrows ────────────────────────── */}
          {relatedBooks.length > 0 && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 p-3 shadow-xl backdrop-blur-md border border-amber-200/30 transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Previous"
              >
                <ChevronRight className="h-5 w-5 rotate-180 text-amber-700" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 p-3 shadow-xl backdrop-blur-md border border-amber-200/30 transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-amber-700" />
              </button>
            </>
          )}
        </div>

        {/* ─── Pagination ──────────────────────────────────── */}
        {relatedBooks.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-500 rounded-full ${index === selectedIndex
                  ? 'w-10 h-2 bg-gradient-to-r from-amber-500 to-emerald-600 shadow-md'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};