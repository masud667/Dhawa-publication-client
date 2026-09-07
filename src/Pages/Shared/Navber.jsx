// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

import FullNavbar from './FullNavbar';
import CompactNavbar from './CompactNavbar';
import { menuItems as defaultMenuItems } from '../../data/headerData';
import useAdminAuth from '../../Admin/useAdminAuth';

// Admin navigation items for mobile drawer
const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  { id: 'manage-books', label: 'Manage Books', path: '/admin/books' },
  { id: 'orders', label: 'Orders', path: '/admin/orders' },
  { id: 'users', label: 'Users', path: '/admin/users' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAdminAuth();

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const currentMenuItems = isAdmin ? adminMenuItems : defaultMenuItems;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');

  // ─── Scroll Listener for Sticky State ────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Mobile Menu Toggle ───────────────────────────────────
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // ─── Mobile Search Submission ─────────────────────────────
  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (!mobileSearchTerm.trim()) return;

    setIsMobileMenuOpen(false);
    const targetPath = isAdmin
      ? `/admin/books?search=${encodeURIComponent(mobileSearchTerm.trim())}`
      : `/books?search=${encodeURIComponent(mobileSearchTerm.trim())}`;

    navigate(targetPath);
  };

  return (
    <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md transition-all duration-300">
      {/* ─── Full Navbar (3 layers) ────────────────────────── */}
      <div
        className={`transition-all duration-300 ${isScrolled ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[500px] opacity-100'
          }`}
      >
        <FullNavbar />
      </div>

      {/* ─── Compact Navbar (scrolled) ──────────────────────── */}
      <div
        className={`transition-all duration-300 ${isScrolled ? 'max-h-16 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
          }`}
      >
        <CompactNavbar />
      </div>

      {/* ─── Mobile Hamburger (integrated into layout) ──────── */}
      {!isScrolled && (
        <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-emerald-600/30">
          {/* Left: Menu button */}
          <button onClick={toggleMobileMenu} className="btn btn-ghost btn-sm gap-2 text-white">
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            <span className="text-sm">{isMobileMenuOpen ? 'বন্ধ' : 'মেনু'}</span>
          </button>

          {/* Right: Toggle mobile search menu */}
          <button onClick={toggleMobileMenu} className="btn btn-ghost btn-sm text-white">
            <FaSearch size={16} />
          </button>
        </div>
      )}

      {/* ─── Scrolled: Only hamburger icon (no extra bar) ──── */}
      {isScrolled && (
        <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <button onClick={toggleMobileMenu} className="btn btn-ghost btn-circle text-white">
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      )}

      {/* ─── Mobile Menu Overlay ────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-emerald-700 shadow-lg py-4 px-4 border-t border-emerald-600/30 z-30 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {currentMenuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-emerald-500 text-white'
                    : 'text-white hover:bg-emerald-600/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile search form */}
          <form onSubmit={handleMobileSearchSubmit} className="mt-4 flex">
            <input
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder={isAdmin ? "বই বা অর্ডার খুঁজুন..." : "বই খুঁজুন..."}
              className="input input-bordered flex-1 rounded-r-none border-gray-300 bg-white text-black text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="btn rounded-l-none bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white px-3"
            >
              <FaSearch size={14} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;