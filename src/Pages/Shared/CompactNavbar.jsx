// src/components/Layout/CompactNavbar.jsx
import React from 'react';
import { NavLink } from 'react-router';
import { FaShoppingBag } from 'react-icons/fa';

import Logo from './Logo/Logo';
import UserMenu from '../Home/UserMenu';
import CartDropdown from '../../cart/CartDropdown';
import { menuItems } from '../../data/headerData';
import { useCartStore } from '../../store/cartStore';

const CompactNavbar = () => {
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <div className="container mx-auto px-4 py-1 flex items-center justify-between h-14">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Nav Links (hidden on mobile, shown on lg) */}
      <nav className="hidden lg:flex items-center gap-6">
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
      </nav>

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
  );
};

export default CompactNavbar;