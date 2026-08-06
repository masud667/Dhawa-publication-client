import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  AlertCircle,
} from 'lucide-react';
import { BookCardSkeleton } from '../Home/RecentBooks/BookCardSkeleton';
import { BookCard } from '../Home/RecentBooks/BookCard';


const Books = () => {
  // ─── State ──────────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // ─── Fetch Books from DB ────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          'http://localhost:5000/books',
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Make sure MongoDB API returns an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        // Ignore request cancellation
        if (err.name === 'AbortError') return;

        console.error('Error fetching books:', err);

        setError(
          err.message ||
          'Failed to load books. Please try again later.'
        );

        setBooks([]);
        setFilteredBooks([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, []);

  // ─── Filter & Sort Logic ─────────────────────────────────────
  useEffect(() => {
    let result = [...books];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (book) =>
          (book.title || '').toLowerCase().includes(query) ||
          (book.author || '').toLowerCase().includes(query) ||
          (book.category || '').toLowerCase().includes(query)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter((book) => book.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [books, searchQuery, selectedCategory, sortBy]);

  // ─── Categories ────────────────────────────────────────────────
  const categories = ['all', ...new Set(books.map((book) => book.category).filter(Boolean))];

  // ─── Pagination ──────────────────────────────────────────────
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* ─── Hero Header ────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#174d3b] to-[#2d6a55] py-12 md:py-20">
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" stroke="#D4A559" strokeWidth="0.5" fill="none" />
                <circle cx="30" cy="30" r="3" fill="#D4A559" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroPattern)" />
          </svg>
        </div>
        <div className="container relative z-10 mx-auto max-w-[1200px] px-4 text-center text-white">
          <h1 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
            সকল বই
          </h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            আমাদের সংগ্রহ থেকে আপনার পছন্দের বই খুঁজুন
          </p>
          <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-[#D4A559]" />
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────── */}
      <div className="container mx-auto max-w-[1200px] px-4 py-6 md:py-10">
        {/* ─── Filter Bar ────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm border border-amber-200/30 md:p-4">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="বই খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-500 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <div className="hidden md:flex items-center gap-3 ">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-gray-200 bg-white py-2 pl-3 pr-7 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
            >
              {categories.map((cat) => (
                <option

                  key={cat} value={cat}>
                  {cat === 'all' ? 'সব ক্যাটাগরি' : cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-gray-200 bg-white py-2 pl-3 pr-7 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
            >
              <option value="newest">সর্বশেষ</option>
              <option value="price-low">দাম: কম→বেশি</option>
              <option value="price-high">দাম: বেশি→কম</option>
              <option value="rating">রেটিং</option>
            </select>

            <div className="flex gap-1 rounded-full border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-full p-1.5 transition ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400'
                  }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-full p-1.5 transition ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400'
                  }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <span className="hidden text-sm text-gray-500 sm:block">
            {filteredBooks.length}টি বই
          </span>
        </div>

        {/* ─── Mobile Filters ────────────────────────────────── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-6 overflow-hidden"
            >
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-amber-200/30 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-emerald-600">ক্যাটাগরি</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500 text-gray-900 placeholder:text-gray-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'সব ক্যাটাগরি' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-emerald-600">সাজান</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                  >
                    <option value="newest">সর্বশেষ</option>
                    <option value="price-low">দাম: কম→বেশি</option>
                    <option value="price-high">দাম: বেশি→কম</option>
                    <option value="rating">রেটিং</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSortBy('newest');
                    }}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    সব রিসেট
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white"
                  >
                    প্রয়োগ
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Error State ────────────────────────────────────── */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <h3 className="mt-2 text-lg font-semibold text-red-700">বই লোড করতে সমস্যা হয়েছে</h3>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* ─── Books Grid ────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-[#263d35]">কোনো বই পাওয়া যায়নি</h3>
            <p className="mt-2 text-sm text-gray-500">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো বই নেই।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 rounded-full border border-[#2d6a55] px-6 py-2 text-sm font-semibold text-[#215b47] transition hover:bg-[#215b47] hover:text-white"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid grid-cols-2 gap-4 sm:gap-5 ${viewMode === 'grid'
              ? 'sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4'
              : 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1'
              }`}
          >
            {currentBooks.map((book, index) => (
              <motion.div
                key={book._id || book.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={viewMode === 'list' ? 'col-span-full' : ''}
              >
                {viewMode === 'list' ? (
                  <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/30 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row">
                    <img
                      src={book.image || '/default-book.jpg'}
                      alt={book.title}
                      className="h-32 w-24 rounded-lg border object-cover sm:h-40 sm:w-28"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#174D3B]">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{book.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-3">
                          {book.discountPrice ? (
                            <>
                              <span className="text-xl font-bold text-emerald-700">৳{book.discountPrice}</span>
                              <span className="text-sm text-gray-400 line-through">৳{book.price}</span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-emerald-700">৳{book.price}</span>
                          )}
                          <span className="text-xs text-gray-400">{book.rating}★</span>
                        </div>
                        <Link
                          to={`/books/${book._id}`}
                          className="rounded-full border border-[#2d6a55] px-4 py-1.5 text-sm font-medium text-[#215b47] transition hover:bg-[#215b47] hover:text-white"
                        >
                          বিস্তারিত
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <BookCard book={book} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}


        {/* ─── Pagination ────────────────────────────────────── */}
        {!isLoading && filteredBooks.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-emerald-200/40 bg-white/60 px-4 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 hover:shadow-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none"
            >
              ← আগে
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-9 w-9 rounded-full text-sm font-medium transition ${currentPage === pageNum
                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-md shadow-emerald-700/30 ring-2 ring-emerald-200'
                    : 'border border-emerald-200/30 bg-white/60 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-emerald-200/40 bg-white/60 px-4 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 hover:shadow-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none"
            >
              পরে →
            </button>
          </div>
        )}



      </div>
    </div>
  );
};

export default Books;