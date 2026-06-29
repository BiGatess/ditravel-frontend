import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  date: string;
  type: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateQuantity: (id: string | number, delta: number) => void;
  removeRow: (id: string | number) => void;
  totalPrice: number;
  totalItems: number;
  cartBadgeCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateQuantity = (id: string | number, delta: number) => {
    setCartItems(curr => curr.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeRow = (id: string | number) => {
    setCartItems(curr => curr.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadgeCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, updateQuantity, removeRow, totalPrice, totalItems, cartBadgeCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
