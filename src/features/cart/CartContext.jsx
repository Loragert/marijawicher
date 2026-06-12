import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CART_STORAGE_KEY, createCartState } from "./cartModel.js";

const CartContext = createContext(null);

function readStoredCart() {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

function createCartItem(product) {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: Number(product.price || 0),
    cover_image: product.cover_image || "",
    quantity: 1,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart());

  const cart = useMemo(() => createCartState(items), [items]);
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
  }, [cart.items]);

  function addItem(product) {
    setItems((currentItems) => {
      const nextItems = [...currentItems];
      const existingIndex = nextItems.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + 1,
        };
        return nextItems;
      }

      return [...nextItems, createCartItem(product)];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, Number.parseInt(quantity, 10) || 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function increaseQuantity(productId) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(productId) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(productId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(
    () => ({
      ...cart,
      itemCount,
      addItem,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
    }),
    [cart, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
