// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { FaSearch, FaUser, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';

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

  // ─── TopBar scroll hide state ──────────────────────────────
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50  bg-emerald-700 text-white shadow-md">
      {/* ─── Top Bar with slide animation ────────────────────── */}
      <div
        className={`transition-transform duration-300 ease-in-out ${!isTopBarVisible ? '-translate-y-full' : 'translate-y-0'
          }`}
      >
        <TopBar />
      </div>
      {/* ─── Main Nav ───────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* ─── Logo ────────────────────────────────────────── */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* ─── Desktop Menu ───────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 text-white hover:text-gray-200 ${isActive ? 'text-emerald-900 border-b-2 border-emerald-500' : 'text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ─── Search + Cart + User ───────────────────────── */}
          <div className="flex items-center gap-3">
            {/* ─── Search ────────────────────────────────────── */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center ">
              <input
                type="text"
                placeholder="বই খুঁজুন..."
                className="input input-bordered input-sm w-40 lg:w-56 rounded-r-none border-gray-300 focus:border-emerald-500 focus:outline-none bg-white text-gray-900"
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

            {/* ─── Cart ──────────────────────────────────────── */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
                <FaShoppingBag size={20} className="text-white hover:text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <CartDropdown />
            </div>

            {/* ─── User / Login ─────────────────────────────── */}
            <UserMenu />

            {/* ─── Mobile Menu Toggle ───────────────────────── */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden btn btn-ghost btn-circle"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ───────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            {/* Mobile Search */}
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
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'text-white hover:bg-gray-50 hover:text-black'
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