// src/components/Cart/CartDropdown.jsx
import React from 'react';
import { NavLink } from 'react-router';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore';

const CartDropdown = () => {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const totalItems = useCartStore((state) => state.totalItems);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div tabIndex={0} className="dropdown-content card card-sm bg-emerald-700 z-10 mt-3 w-80 shadow-xl rounded-lg border border-gray-100">
      <div className="card-body p-4">
        {totalItems === 0 ? (
          <div className="text-center py-6">
            <FaShoppingBag className="mx-auto text-4xl text-white mb-2" />
            <p className="text-white text-sm">আপনার কার্ট খালি</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-2">
                  <img
                    src={item.image || '/default-book.jpg'}
                    alt={item.title}
                    className="h-14 w-12 rounded object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-white">
                      {item.quantity} × ৳{item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn btn-ghost btn-xs text-red-400 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-white">সর্বমোট:</span>
                <span className="text-white">৳{totalPrice}</span>
              </div>
              <div className="card-actions mt-3">
                <NavLink to="/cart" className="btn btn-primary btn-block bg-emerald-600 hover:bg-emerald-700 border-none  text-white rounded-full text-sm">
                  কার্ট দেখুন
                </NavLink>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;