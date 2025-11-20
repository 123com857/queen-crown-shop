import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { products } = useShop();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const displayProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] md:h-[800px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1546167889-0b4f5ff31735?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Bride" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-wider drop-shadow-lg">
            为加冕而生
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mb-10 tracking-widest text-stone-100">
            2025 春季高定系列 · 每一颗水钻都值得被看见
          </p>
          <a href="#shop" className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 text-lg font-medium tracking-widest transition-all transform hover:scale-105 duration-300">
            立即探索
          </a>
        </div>
      </div>

      {/* Shop Section */}
      <div id="shop" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-stone-900 flex items-center gap-3">
            <span className="w-1 h-8 bg-gold-500 block"></span>
            热销甄选
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mt-6 md:mt-0 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1 border rounded-full text-sm transition-colors whitespace-nowrap ${
                  filter === cat 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'border-stone-200 text-stone-600 hover:border-gold-500 hover:text-gold-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {displayProducts.slice(0, 24).map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="group block">
              <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-4">
                <img 
                  src={product.mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-2 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
                  <span className="text-xs text-stone-600 uppercase tracking-wider">查看详情</span>
                  <ArrowRight className="h-4 w-4 text-gold-700" />
                </div>
                {/* Badge for styling */}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 tracking-wider">
                  HOT
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-stone-900 font-serif font-medium truncate pr-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gold-700 font-bold">¥{product.price}</p>
                  <div className="flex items-center text-stone-400 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {product.sales}+人付款
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="border-b-2 border-stone-900 pb-1 text-stone-900 font-serif text-lg hover:text-gold-700 hover:border-gold-700 transition-all">
            加载更多款式 (200+)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;