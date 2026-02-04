import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Bouquet } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (bouquetId: string) => void;
  removeItem: (bouquetId: string) => void;
  updateQuantity: (bouquetId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (bouquetId: string) => boolean;
  getBouquetById: (bouquetId: string) => Bouquet | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'florett_cart';

interface CartProviderProps {
  children: React.ReactNode;
  bouquets: Bouquet[];
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, bouquets }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((bouquetId: string) => {
    setItems(prev => {
      const existing = prev.find(item => item.bouquetId === bouquetId);
      if (existing) {
        return prev.map(item =>
          item.bouquetId === bouquetId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { bouquetId, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((bouquetId: string) => {
    setItems(prev => prev.filter(item => item.bouquetId !== bouquetId));
  }, []);

  const updateQuantity = useCallback((bouquetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bouquetId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.bouquetId === bouquetId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getBouquetById = useCallback((bouquetId: string) => {
    return bouquets.find(b => b.id === bouquetId);
  }, [bouquets]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const bouquet = getBouquetById(item.bouquetId);
      return total + (bouquet?.price || 0) * item.quantity;
    }, 0);
  }, [items, getBouquetById]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((bouquetId: string) => {
    return items.some(item => item.bouquetId === bouquetId);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isInCart,
      getBouquetById
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
