// src/components/Layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

import FullNavbar from './FullNavbar';
import CompactNavbar from './CompactNavbar';
import { menuItems } from '../../data/headerData';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // // const lastScrollY = useRef(0);

  // // ─── Scroll detection ──────────────────────────────────────
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  //     if (currentScrollY <= 20) {
  //       setIsScrolled(false);
  //     } else if (currentScrollY > lastScrollY.current) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //     lastScrollY.current = currentScrollY;
  //   };

  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // ─── Mobile menu toggle ────────────────────────────────────
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md transition-all duration-300">
      {/* ─── Full Navbar (3 layers) ────────────────────────── */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[500px] opacity-100'
        }`}
      >
        <FullNavbar />
      </div>

      {/* ─── Compact Navbar (scrolled) ──────────────────────── */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? 'max-h-16 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <CompactNavbar />
      </div>

      {/* ─── Mobile Hamburger (integrated into layout) ──────── */}
      {/* This is a separate bar that appears ONLY on mobile, below the main navbar */}
      {!isScrolled && (
        <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-emerald-600/30">
          {/* Left: Menu button */}
          <button onClick={toggleMobileMenu} className="btn btn-ghost btn-sm gap-2 text-white">
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            <span className="text-sm">{isMobileMenuOpen ? 'বন্ধ' : 'মেনু'}</span>
          </button>

          {/* Right: Search icon (optional) */}
          <button className="btn btn-ghost btn-sm text-white">
            <FaSearch size={16} />
          </button>
        </div>
      )}

      {/* ─── Scrolled: Only hamburger icon (no extra bar) ──── */}
      {isScrolled && (
        <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <button onClick={toggleMobileMenu} className="btn btn-ghost btn-circle">
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      )}

      {/* ─── Mobile Menu Overlay ────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-emerald-700 shadow-lg py-4 px-4 border-t border-emerald-600/30 z-30 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'text-white hover:bg-emerald-600/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {/* Mobile search */}
          <form className="mt-4 flex">
            <input
              type="text"
              placeholder="বই খুঁজুন..."
              className="input input-bordered flex-1 rounded-r-none border-gray-300 bg-white text-black"
            />
            <button className="btn rounded-l-none bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white px-3">
              <FaSearch size={14} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;