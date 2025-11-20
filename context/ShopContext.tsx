import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, OrderStatus, PaymentAccount } from '../types';
import { PRODUCTS, PAYMENT_ACCOUNTS } from '../services/mockData';
import { sendSMS } from '../services/smsService';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (customerDetails: any) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  paymentAccounts: any[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Load orders from localStorage for persistency demo
  useEffect(() => {
    const savedOrders = localStorage.getItem('royal_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('royal_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        // Prevent adding more than stock
        if (existing.quantity >= product.stock) return prev;
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerDetails: any) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalCost = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    
    // Deduct Stock
    setProducts(prev => prev.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
    }));

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      address: customerDetails.address,
      paymentMethod: customerDetails.paymentMethod,
      items: [...cart],
      totalAmount,
      totalCost,
      profit: totalAmount - totalCost,
      status: OrderStatus.PENDING_PAYMENT,
      createdAt: Date.now(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Mock SMS
    await sendSMS(newOrder.customerPhone, 'ORDER_CREATED', { orderId: newOrder.id });

    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (status === OrderStatus.SHIPPED) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
             sendSMS(order.customerPhone, 'ORDER_SHIPPED', { tracking: 'SF' + Date.now() });
        }
    }
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  return (
    <ShopContext.Provider value={{ 
      products, 
      cart, 
      orders, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      placeOrder, 
      updateOrderStatus,
      updateProductStock,
      paymentAccounts: PAYMENT_ACCOUNTS
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};