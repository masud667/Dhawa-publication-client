// src/components/Layout/FullNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { FaSearch, FaShoppingBag } from 'react-icons/fa';

import Logo from './Logo/Logo';
import UserMenu from '../Home/UserMenu';
import CartDropdown from '../../cart/CartDropdown';
import { menuItems as defaultMenuItems, adminMenuItems } from '../../data/headerData';
import { useCartStore } from '../../store/cartStore';
import TopBar from '../../Layout/TopBar';
import api from '../../api/axios';
import useAdminAuth from '../../Admin/useAdminAuth';

const FullNavbar = () => {
  const { user, isAuthenticated } = useAdminAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const activeMenuItems = isAdmin ? adminMenuItems : defaultMenuItems;

  const totalItems = useCartStore((state) => state.totalItems);
  const navigate = useNavigate();

  // ─── Search States & Refs ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  // ─── Professional Relevance-Based Scoring Function ─────────────────
  const rankResultsByRelevance = (books, query) => {
    const q = query.toLowerCase().trim();

    return [...books]
      .map((book) => {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();

        let score = 0;

        // 1. Exact title match (Highest Priority)
        if (title === q) score += 100;
        // 2. Title starts with query (First letter / prefix match)
        else if (title.startsWith(q)) score += 80;
        // 3. Word inside title starts with query
        else if (title.split(' ').some((word) => word.startsWith(q))) score += 60;
        // 4. Title contains query anywhere else
        else if (title.includes(q)) score += 40;

        // 5. Author matches
        if (author.startsWith(q)) score += 30;
        else if (author.includes(q)) score += 10;

        return { book, score };
      })
      // Sort in descending order: Highest relevance score first
      .sort((a, b) => b.score - a.score)
      .map((item) => item.book);
  };

  // ─── Debounced Fetch Suggestions ──────────────────────────────────
  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/books?search=${encodeURIComponent(query)}`);

        // Normalizing API response payload
        const rawBooks = Array.isArray(data) ? data : data.books || [];

        // Apply relevance ranking (Prefix matches show first)
        const sortedBooks = rankResultsByRelevance(rawBooks, query);

        setSuggestions(sortedBooks.slice(0, 6)); // Top 6 results
        setIsOpen(true);
      } catch (error) {
        console.error('Search suggestion fetch error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ─── Close Suggestions on Outside Click ───────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Form Submission Handler ──────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsOpen(false);

    // Redirect admin search to admin page, user search to store page
    const targetPath = isAdmin
      ? `/admin/books?search=${encodeURIComponent(searchTerm.trim())}`
      : `/books?search=${encodeURIComponent(searchTerm.trim())}`;

    navigate(targetPath);
  };

  return (
    <>
      {/* Layer 1: TopBar (hidden on mobile) */}
      <div className="hidden sm:block">
        <TopBar />
      </div>

      {/* Layer 2: Logo + Search (desktop) + Cart/User */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Search – hidden on mobile, shown from md upwards */}
        <div className="relative hidden md:flex flex-1 min-w-[180px] max-w-2xl" ref={containerRef}>
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setIsOpen(true)}
              placeholder={isAdmin ? "বই বা উপাদান খুঁজুন..." : "বই খুঁজুন..."}
              className="input input-bordered w-full rounded-r-none border-gray-300 focus:border-emerald-500 focus:outline-none bg-white text-gray-900 h-9 sm:h-10 text-sm"
            />
            <button
              type="submit"
              className="btn rounded-l-none bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white px-3 sm:px-4 h-9 sm:h-10"
            >
              <FaSearch size={14} className="sm:size-4" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {isLoading ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  খোঁজা হচ্ছে...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {suggestions.map((book) => {
                    const bookId = book._id || book.id;
                    const bookPrice = Number(book.discountPrice || book.price || 0);
                    const detailPath = isAdmin ? `/admin/books/edit/${bookId}` : `/books/${bookId}`;

                    return (
                      <li key={bookId}>
                        <Link
                          to={detailPath}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 transition hover:bg-emerald-50"
                        >
                          <img
                            src={book.image || 'https://placehold.co/600x850/F4F0E8/174D3B?text=Book'}
                            alt={book.title}
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x850/F4F0E8/174D3B?text=Book';
                            }}
                            className="h-10 w-8 rounded object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium text-gray-900">
                              {book.title}
                            </h4>
                            {book.author && (
                              <p className="truncate text-xs text-gray-500">
                                {book.author}
                              </p>
                            )}
                          </div>
                          {bookPrice > 0 && (
                            <div className="text-right text-xs font-semibold text-emerald-600 shrink-0">
                              {bookPrice.toLocaleString('en-US')}৳
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-3 text-center text-sm text-gray-500">
                  কোনো বই পাওয়া যায়নি
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart + User (always visible) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Hide Cart for Admins */}
          {!isAdmin && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
                <FaShoppingBag size={18} className="sm:size-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] sm:text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <CartDropdown />
            </div>
          )}
          <UserMenu />
        </div>
      </div>

      {/* Layer 3: Menu Bar (hidden on mobile) */}
      <nav className="hidden lg:flex border-t border-emerald-600/30 py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-8">
          {activeMenuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive
                  ? 'text-amber-300 border-b-2 border-amber-300'
                  : 'text-white hover:text-gray-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default FullNavbar;