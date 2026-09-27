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

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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
        const response = await api.get(`/books?search=${encodeURIComponent(query)}`);
        const rawBooks = Array.isArray(response.data)
          ? response.data
          : response.data?.books || response.data?.data || [];

        const sortedBooks = rankResultsByRelevance(rawBooks, query);
        setSuggestions(sortedBooks.slice(0, 6));
        setIsOpen(true);
      } catch (error) {
        console.error('Search fetch error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsOpen(false);
    const targetPath = isAdmin
      ? `/admin/books?search=${encodeURIComponent(searchTerm.trim())}`
      : `/books?search=${encodeURIComponent(searchTerm.trim())}`;

    navigate(targetPath);
  };

  return (
    <>
      {/* TopBar */}
      <div className="hidden sm:block border-b border-emerald-600/30">
        <TopBar />
      </div>

      {/* Main Header Row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Search Bar Container */}
        <div className="relative hidden md:flex flex-1 min-w-[200px] max-w-2xl items-center h-10 shrink-0" ref={containerRef}>
          <form onSubmit={handleSubmit} className="flex w-full items-center h-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setIsOpen(true)}
              placeholder={isAdmin ? "বই বা উপাদান খুঁজুন..." : "বই খুঁজুন..."}
              className="w-full h-full rounded-l-lg border-0 bg-white text-gray-900 px-3.5 text-sm focus:outline-none shadow-sm"
            />
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 h-full rounded-r-lg flex items-center justify-center shrink-0 transition-colors"
            >
              <FaSearch size={14} />
            </button>
          </form>

          {/* Search Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg text-gray-900">
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

        {/* Cart + Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {!isAdmin && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
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
        </div>
      </div>

      {/* Navigation Links Layer */}
      <nav className="hidden lg:flex border-t border-emerald-600/30 py-2.5">
        <div className="container mx-auto px-4 flex items-center justify-center gap-8">
          {activeMenuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive
                  ? 'text-amber-300 font-semibold border-b-2 border-amber-300 pb-0.5'
                  : 'text-white hover:text-emerald-100'
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