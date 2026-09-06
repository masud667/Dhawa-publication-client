import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { FaUser, FaSignOutAlt, FaUserCog, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../Context/AuthContext';

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logOut, loading } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('লগআউট সফল হয়েছে');
      navigate('/');
    } catch (error) {
      toast.error('লগআউট করতে সমস্যা হয়েছে');
    }
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <NavLink
        to="/login"
        className="btn btn-ghost btn-sm gap-2 text-white"
      >
        <FaUser size={16} />
        <span className="hidden sm:inline">লগইন</span>
      </NavLink>
    );
  }

  return (
    <div className="dropdown dropdown-end text-black">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-white" size={14} />
          )}
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-gray-100"
      >
        <li>
          <span className="text-xs text-gray-400 font-semibold border-b border-gray-100 pb-2 mb-1 pointer-events-none">
            {user.displayName ? user.displayName : 'আমার অ্যাকাউন্ট'}
          </span>
        </li>
        <li>
          <NavLink to="/account/profile" className="flex items-center gap-3 py-2">
            <FaUserCog size={14} className="text-emerald-700" /> প্রোফাইল
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/orders" className="flex items-center gap-3 py-2">
            <FaShoppingBag size={14} className="text-emerald-700" /> অর্ডারসমূহ
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/wishlist" className="flex items-center gap-3 py-2">
            <FaHeart size={14} className="text-emerald-700" /> উইশলিস্ট
          </NavLink>
        </li>
        <li className="mt-1 border-t border-gray-100 pt-1">
          <button
            onClick={handleLogout}
            type="button"
            className="flex w-full items-center gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md px-3 py-2 font-medium"
          >
            <FaSignOutAlt size={14} /> লগআউট
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;