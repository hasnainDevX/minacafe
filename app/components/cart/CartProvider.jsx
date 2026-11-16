"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { cartStore } from "../../lib/cart-store";
import CartDrawer from "./CartDrawer";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [open, setOpen] = useState(false);
  useEffect(() => cartStore.initialize(), []);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, count, open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem: (id, variant) => { cartStore.add(id, variant); setOpen(true); },
      setQuantity: cartStore.setQuantity,
      removeItem: cartStore.remove,
    }}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}
