// src/components/User/UserMenu.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { FaUser, FaUserCircle, FaSignOutAlt, FaUserCog, FaHeart, FaShoppingBag } from 'react-icons/fa';

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state

  if (!isLoggedIn) {
    return (
      <NavLink
        to="/login"
        className="btn btn-ghost btn-sm gap-2 text-white "
      >
        <FaUser size={16} />
        <span className="hidden sm:inline">লগইন</span>
      </NavLink>
    );
  }

  return (
    <div className="dropdown dropdown-end text-white">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <FaUser className="text-white" size={16} />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-gray-100"
      >
        <li>
          <span className="text-xs text-gray-500 border-b border-gray-100 pb-2 mb-1">আমার অ্যাকাউন্ট</span>
        </li>
        <li>
          <NavLink to="/account/profile" className="flex items-center gap-3">
            <FaUserCog size={14} /> প্রোফাইল
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/orders" className="flex items-center gap-3">
            <FaShoppingBag size={14} /> অর্ডারসমূহ
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/wishlist" className="flex items-center gap-3">
            <FaHeart size={14} /> উইশলিস্ট
          </NavLink>
        </li>
        <li className="mt-1 border-t border-gray-100 pt-1">
          <button className="flex w-full items-center gap-3 text-red-500 hover:bg-red-50 rounded-md px-3 py-2">
            <FaSignOutAlt size={14} /> লগআউট
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;