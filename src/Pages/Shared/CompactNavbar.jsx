// src/components/Layout/CompactNavbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { FaSearch, FaShoppingBag } from 'react-icons/fa';

import Logo from './Logo/Logo';
import UserMenu from '../Home/UserMenu';
import CartDropdown from '../../cart/CartDropdown';
import { menuItems as defaultMenuItems, adminMenuItems } from '../../data/headerData';
import { useCartStore } from '../../store/cartStore';
import useAdminAuth from '../../Admin/useAdminAuth';

const CompactNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAdminAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const activeMenuItems = isAdmin ? adminMenuItems : defaultMenuItems;

  const totalItems = useCartStore((state) => state.totalItems);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const targetPath = isAdmin
      ? `/admin/books?search=${encodeURIComponent(searchTerm.trim())}`
      : `/books?search=${encodeURIComponent(searchTerm.trim())}`;

    navigate(targetPath);
  };

  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
      {/* ─── Left: Compact Logo ─────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* ─── Center: Navigation Links ───────────────────────────────── */}
      <nav className="hidden lg:flex items-center gap-6">
        {activeMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive
                ? 'text-amber-300 font-semibold'
                : 'text-white hover:text-emerald-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* ─── Right: Quick Search + Cart + Profile ────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Compact Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="খুঁজুন..."
              className="input input-sm bg-emerald-800/60 text-white placeholder-emerald-200 border-emerald-600 focus:outline-none focus:border-amber-300 rounded-full pl-3 pr-8 w-36 sm:w-48 text-xs"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-white"
            >
              <FaSearch size={12} />
            </button>
          </div>
        </form>

        {/* Cart Icon (Hidden for Admins) */}
        {!isAdmin && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm relative">
              <FaShoppingBag size={16} className="text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
            <CartDropdown />
          </div>
        )}

        {/* User / Profile Menu */}
        <UserMenu />
      </div>
    </div>
  );
};

export default CompactNavbar;