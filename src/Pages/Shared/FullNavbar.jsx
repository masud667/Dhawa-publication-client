// src/components/Layout/FullNavbar.jsx
import React from 'react';
import { NavLink } from 'react-router';
import { FaSearch, FaShoppingBag } from 'react-icons/fa';


import Logo from './Logo/Logo';
import UserMenu from '../Home/UserMenu';
import CartDropdown from '../../cart/CartDropdown';
import { menuItems } from '../../data/headerData';
import { useCartStore } from '../../store/cartStore';
import TopBar from '../../Layout/TopBar';

const FullNavbar = () => {
  const totalItems = useCartStore((state) => state.totalItems);

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
        <div className="hidden md:flex flex-1 min-w-[180px] max-w-2xl">
          <form className="flex w-full">
            <input
              type="text"
              placeholder="বই খুঁজুন..."
              className="input input-bordered w-full rounded-r-none border-gray-300 focus:border-emerald-500 focus:outline-none bg-white text-gray-900 h-9 sm:h-10"
            />
            <button
              type="submit"
              className="btn rounded-l-none bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white px-3 sm:px-4 h-9 sm:h-10"
            >
              <FaSearch size={14} className="sm:size-4" />
            </button>
          </form>
        </div>

        {/* Cart + User (always visible) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
          <UserMenu />
        </div>
      </div>

      {/* Layer 3: Menu Bar (hidden on mobile) */}
      <nav className="hidden lg:flex border-t border-emerald-600/30 py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive
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