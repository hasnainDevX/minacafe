"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { cartStore } from "../../lib/cart-store";
import { products } from "../../assets/products";
import CartToast from "./CartToast";
import CartDrawer from "./CartDrawer";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);
  useEffect(() => cartStore.initialize(), []);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, count, open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem: (id, variant) => {
        const product = products.find(item => item.id === id);
        if (!product) return;
        cartStore.add(id, variant);
        const option = product.variants?.find(item => item.id === variant);
        setToast({ name: `${product.name}${option ? ` (${option.label})` : ""}` });
      },
      setQuantity: cartStore.setQuantity,
      removeItem: cartStore.remove,
    }}>
      {children}
      <CartDrawer />
      <CartToast toast={toast} onDismiss={dismissToast} onOpen={() => { dismissToast(); setOpen(true); }} />
    </CartContext.Provider>
  );
}
