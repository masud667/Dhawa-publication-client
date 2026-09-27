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
      {/* Left: Compact Logo */}
      <div className="shrink-0 flex items-center h-full">
        <Logo />
      </div>

      {/* Center: Navigation Links */}
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

      {/* Right: Quick Search Input + Cart + Profile */}
      <div className="flex items-center gap-3 shrink-0">


        {!isAdmin && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm relative">
              <FaShoppingBag size={16} className="text-white" />
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
  );
};

export default CompactNavbar;