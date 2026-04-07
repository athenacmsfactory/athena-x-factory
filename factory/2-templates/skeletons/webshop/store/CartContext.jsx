import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CartContext = createContext();

export const CartProvider = ({ children, siteId = 'athena_shop' }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const storageKey = `athena_cart_${siteId}`;

  // 1. Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Initial Cart (Guest or User)
  useEffect(() => {
    let unsubscribeFirestore = () => {};

    if (user) {
      // User is logged in: Listen to Firestore cart
      const cartDocRef = doc(db, 'carts', user.uid);
      unsubscribeFirestore = onSnapshot(cartDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setCart(snapshot.data().items || []);
        } else {
          // If Firestore is empty, try to merge from localStorage
          const localCart = localStorage.getItem(storageKey);
          if (localCart) {
            const items = JSON.parse(localCart);
            setDoc(cartDocRef, { items, updatedAt: new Date() });
            setCart(items);
          }
        }
      });
    } else {
      // Guest: Load from localStorage
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse local cart", e);
        }
      }
    }

    return () => unsubscribeFirestore();
  }, [user, storageKey]);

  // 3. Save Cart (Guest: LocalStorage, User: Firestore)
  const saveCart = useCallback(async (newCart) => {
    setCart(newCart);
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      await setDoc(cartDocRef, { items: newCart, updatedAt: new Date() });
    } else {
      localStorage.setItem(storageKey, JSON.stringify(newCart));
    }
  }, [user, storageKey]);

  const addToCart = useCallback((product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    saveCart(newCart);
    setIsCartOpen(true);
  }, [cart, saveCart]);

  const updateQuantity = useCallback((productId, delta) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0);
    saveCart(newCart);
  }, [cart, saveCart]);

  const clearCart = useCallback(() => saveCart([]), [saveCart]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    user
  }), [cart, addToCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, user]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
