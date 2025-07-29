'use client';

import { createContext, useContext, useReducer, useState, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.find(
        item => item.id === action.payload.id && item.variantId === action.payload.variantId
      );

      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id && item.variantId === action.payload.variantId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }

      return [...state, action.payload];
    }

    case 'REMOVE_FROM_CART':
      return state.filter(
        item => !(item.id === action.payload.id && item.variantId === action.payload.variantId)
      );

    case 'UPDATE_QUANTITY':
      return state
        .map(item =>
          item.id === action.payload.id && item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);

    case 'CLEAR_CART':
      return [];

    case 'LOAD_CART':
      return action.payload || [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product, variantId, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        variantId,
        title: product.title,
        price: product.priceRange.minVariantPrice.amount,
        image: product.images.edges[0]?.node.url || '',
        quantity,
        handle: product.handle,
      },
    });
  };

  const removeFromCart = (productId, variantId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: productId, variantId },
    });
  };

  const updateQuantity = (productId, variantId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, variantId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCartDrawer = () => {
    setIsCartOpen(prev => !prev);
  };

  const closeCartDrawer = () => {
    setIsCartOpen(false);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCartDrawer,
    closeCartDrawer,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
