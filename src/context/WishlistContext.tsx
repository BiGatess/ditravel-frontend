import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  location: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // In a real app, this would load from localStorage or an API
  useEffect(() => {
    const saved = localStorage.getItem('ditravel_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ditravel_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
