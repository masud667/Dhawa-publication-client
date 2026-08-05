import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        let newItems;
        if (existing) {
          newItems = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        } else {
          newItems = [...items, { ...item, quantity: item.quantity || 1 }];
        }
        set({
          items: newItems,
          totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0),
          totalPrice: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
        });
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({
          items: newItems,
          totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0),
          totalPrice: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
        });
      },

      updateQuantity: (id, quantity) => {
        const items = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        set({
          items,
          totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
          totalPrice: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'dhawa-cart-storage',
    }
  )
);