// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { FaSearch, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';

import UserMenu from '../Home/UserMenu';
import CartDropdown from '../../cart/CartDropdown';
import TopBar from '../../Layout/TopBar';
import Logo from './Logo/Logo';
import { menuItems } from '../../data/headerData';
import { useCartStore } from '../../store/cartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  // ─── Scroll state ──────────────────────────────────────────
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsTopBarVisible(false);
      } else {
        setIsTopBarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // ─── Search handler ─────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
      {/* ─── Top Bar (হাইড হবে স্ক্রল করলে) ─────────────────── */}
      <div
        className={`transition-transform duration-300 ease-in-out ${
          isTopBarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <TopBar />
      </div>

      {/* ─── Main Nav ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        {/* === প্রথম লাইন === */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isTopBarVisible ? 'py-3' : 'py-1'
          }`}
        >
          {/* বাম: হ্যামবার্গার + লোগো */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden btn btn-ghost btn-circle"
            >
              {isMobileMenuOpen ? (
                <FaTimes size={isTopBarVisible ? 20 : 16} />
              ) : (
                <FaBars size={isTopBarVisible ? 20 : 16} />
              )}
            </button>
            <div className="flex-shrink-0">
              <Logo />
            </div>
          </div>

          {/* 
            মাঝ: 
            - যখন isTopBarVisible = true → সার্চবার দেখাবে
            - যখন false → ডেস্কটপ মেনু দেখাবে (শুধু lg+ স্ক্রিনে)
          */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4 items-center justify-center">
            {isTopBarVisible ? (
              // ── সার্চবার (ভিজible) ──
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  placeholder="বই খুঁজুন..."
                  className={`input input-bordered w-full rounded-r-none border-gray-300 focus:border-emerald-500 focus:outline-none bg-white text-gray-900 transition-all duration-300 ${
                    isTopBarVisible ? 'h-10' : 'h-8'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className={`btn rounded-l-none bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white transition-all duration-300 ${
                    isTopBarVisible ? 'h-10' : 'h-8'
                  } px-4`}
                >
                  <FaSearch size={isTopBarVisible ? 16 : 13} />
                </button>
              </form>
            ) : (
              // ── মেনু (সার্চবারের জায়গায়) ──
              <nav className="flex items-center gap-8">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `text-sm text-white font-medium transition-colors duration-200 hover:text-gray-200 ${
                        isActive
                          ? 'text-emerald-900 border-b-2 border-emerald-500'
                          : 'text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            )}
          </div>

          {/* ডান: কার্ট + ইউজার */}
          <div className={`flex items-center transition-all duration-300 ${isTopBarVisible ? 'gap-3' : 'gap-1.5'}`}>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
                <FaShoppingBag size={isTopBarVisible ? 20 : 16} className="text-white" />
                {totalItems > 0 && (
                  <span className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white transition-all duration-300 ${
                    isTopBarVisible ? 'h-5 w-5' : 'h-4 w-4 text-[10px]'
                  }`}>
                    {totalItems}
                  </span>
                )}
              </div>
              <CartDropdown />
            </div>
            <UserMenu />
          </div>
        </div>

        {/* 
          === ডেস্কটপে দ্বিতীয় লাইন (শুধু যখন isTopBarVisible true) ===
          অর্থাৎ যখন স্ক্রল ডাউন করি, তখন এই মেনু লাইনটা লুকায়,
          কারণ মেনু উপরে চলে গেছে (সার্চবারের জায়গায়)
        */}
        {isTopBarVisible && (
          <nav className="hidden lg:flex items-center justify-center gap-8 py-2 border-t border-emerald-600/30">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 hover:text-gray-200 ${
                    isActive
                      ? 'text-emerald-900 border-b-2 border-emerald-500'
                      : 'text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* === মোবাইল মেনু (যথারীতি) === */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                placeholder="বই খুঁজুন..."
                className="input input-bordered input-sm flex-1 rounded-r-none border-gray-300 bg-white text-black outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-sm rounded-l-none bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
              >
                <FaSearch size={14} />
              </button>
            </form>
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'text-white hover:bg-gray-50 hover:text-black'
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
    </header>
  );
};

export default Navbar;