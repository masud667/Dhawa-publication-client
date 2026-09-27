// src/components/Layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { FaBars, FaTimes, FaSearch, FaShoppingBag } from 'react-icons/fa';

import FullNavbar from './FullNavbar';
import CompactNavbar from './CompactNavbar';
import Logo from './Logo/Logo';
import UserMenu from '../Home/UserMenu';
import CartDropdown from '../../cart/CartDropdown';
import { menuItems as defaultMenuItems, adminMenuItems } from '../../data/headerData';
import { useCartStore } from '../../store/cartStore';
import useAdminAuth from '../../Admin/useAdminAuth';
import api from '../../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAdminAuth();

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const currentMenuItems = isAdmin ? adminMenuItems : defaultMenuItems;
  const totalItems = useCartStore((state) => state.totalItems);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ─── Mobile Search States ──────────────────────────────────────────
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mobileSearchRef = useRef(null);

  // ─── Desktop Scroll Listener ───────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      // Trigger compact mode when scrolling past 100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Relevance Scoring Helper ──────────────────────────────────────
  const rankResultsByRelevance = (books, query) => {
    const q = query.toLowerCase().trim();

    return [...books]
      .map((book) => {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();

        let score = 0;
        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 80;
        else if (title.split(' ').some((word) => word.startsWith(q))) score += 60;
        else if (title.includes(q)) score += 40;

        if (author.startsWith(q)) score += 30;
        else if (author.includes(q)) score += 10;

        return { book, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.book);
  };

  // ─── Debounced Mobile Suggestions Fetch ────────────────────────────
  useEffect(() => {
    const query = mobileSearchTerm.trim();

    if (!query) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/books?search=${encodeURIComponent(query)}`);
        const rawBooks = Array.isArray(response.data)
          ? response.data
          : response.data?.books || response.data?.data || [];

        const sortedBooks = rankResultsByRelevance(rawBooks, query);
        setSuggestions(sortedBooks.slice(0, 5));
        setIsOpen(true);
      } catch (error) {
        console.error('Mobile search fetch error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [mobileSearchTerm]);

  // Close Mobile Suggestions on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsOpen(false);
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (!mobileSearchTerm.trim()) return;

    setIsOpen(false);
    setIsMobileMenuOpen(false);
    const targetPath = isAdmin
      ? `/admin/books?search=${encodeURIComponent(mobileSearchTerm.trim())}`
      : `/books?search=${encodeURIComponent(mobileSearchTerm.trim())}`;

    navigate(targetPath);
  };

  return (
    <>
      {/* ─── DESKTOP VIEW (Fixed Container that never changes layout height) ─── */}
      <div className="hidden lg:block">
        {/* Outer Header Wrapper stays fixed to top */}
        <header
          className={`w-full z-50 transition-all duration-300 ${isScrolled
              ? 'fixed top-0 bg-emerald-700 text-white shadow-lg animate-in slide-in-from-top duration-300'
              : 'relative bg-emerald-700 text-white'
            }`}
        >
          {isScrolled ? <CompactNavbar /> : <FullNavbar />}
        </header>
      </div>

      {/* ─── MOBILE VIEW (< lg) ──────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
        <div className="flex h-16 items-center justify-between px-4 border-b border-emerald-600/30">

          {/* Left: Brand Logo */}
          <div className="shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Right: Cart + User Profile + Mobile Drawer Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isAdmin && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm relative">
                  <FaShoppingBag size={18} className="text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-emerald-950">
                      {totalItems}
                    </span>
                  )}
                </div>
                <CartDropdown />
              </div>
            )}

            <UserMenu />

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-emerald-600/50 text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-emerald-800 shadow-xl py-4 px-4 border-t border-emerald-600/40 z-50 max-h-[85vh] overflow-y-auto">

            {/* Mobile Search Input */}
            <div className="relative mb-4" ref={mobileSearchRef}>
              <form onSubmit={handleMobileSearchSubmit} className="flex">
                <input
                  type="text"
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  onFocus={() => mobileSearchTerm.trim() && setIsOpen(true)}
                  placeholder={isAdmin ? "বই বা উপাদান খুঁজুন..." : "বই খুঁজুন..."}
                  className="w-full rounded-l-lg border-0 bg-white text-gray-900 text-sm px-3.5 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-r-lg bg-amber-500 hover:bg-amber-600 text-emerald-950 px-4 font-semibold text-sm transition-colors flex items-center justify-center shrink-0"
                >
                  <FaSearch size={14} />
                </button>
              </form>

              {/* Mobile Suggestions Dropdown */}
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl text-gray-900">
                  {isLoading ? (
                    <div className="p-3 text-center text-sm text-gray-500">
                      খোঁজা হচ্ছে...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                      {suggestions.map((book) => {
                        const bookId = book._id || book.id;
                        const bookPrice = Number(book.discountPrice || book.price || 0);
                        const detailPath = isAdmin ? `/admin/books/edit/${bookId}` : `/books/${bookId}`;

                        return (
                          <li key={bookId}>
                            <Link
                              to={detailPath}
                              onClick={() => {
                                setIsOpen(false);
                                setIsMobileMenuOpen(false);
                              }}
                              className="flex items-center gap-3 p-2.5 transition hover:bg-emerald-50 active:bg-emerald-100"
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

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              {currentMenuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-amber-500 text-emerald-950 font-bold'
                      : 'text-white hover:bg-emerald-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;