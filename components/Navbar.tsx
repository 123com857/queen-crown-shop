import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, Search, Crown } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cart } = useShop();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gold-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Crown className="h-8 w-8 text-gold-500 group-hover:text-gold-700 transition-colors" />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-stone-900 tracking-widest">ROYAL CROWN</span>
              <span className="text-[10px] text-stone-500 tracking-[0.2em] uppercase">Est. 2025 Luxury</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 font-serif text-sm font-medium text-stone-600">
            <Link to="/" className="hover:text-gold-700 transition-colors">首页</Link>
            <Link to="/#new" className="hover:text-gold-700 transition-colors">新品首发</Link>
            <Link to="/#hot" className="hover:text-gold-700 transition-colors text-red-500">本月爆款</Link>
            <Link to="/admin" className="hover:text-gold-700 transition-colors text-stone-400">商家后台</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <button className="text-stone-400 hover:text-gold-700 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <Link to="/checkout" className="relative text-stone-400 hover:text-gold-700 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button className="md:hidden text-stone-400">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;