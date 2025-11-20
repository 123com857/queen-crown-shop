import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Rotate3d, ShieldCheck, Truck, ShoppingCart, ArrowLeft, PackageX, PackageCheck } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  const product = products.find(p => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  if (!product) return <div className="p-20 text-center">Product Not Found</div>;

  // Handle Zoom Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      navigate('/checkout');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-stone-500 hover:text-stone-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> 返回列表
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Image Gallery & 360 Sim */}
        <div className="space-y-4">
          {/* Main Image Container with Zoom */}
          <div 
            className="relative overflow-hidden bg-stone-100 w-full aspect-square cursor-crosshair border border-stone-200 group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              ref={imageRef}
              src={product.gallery[activeImageIndex]} 
              alt={product.name} 
              className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="bg-stone-900 text-white px-6 py-2 text-xl tracking-widest uppercase font-serif">Sold Out</span>
              </div>
            )}
            {/* Magnifier Overlay */}
            {isZooming && !isOutOfStock && (
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  backgroundImage: `url(${product.gallery[activeImageIndex]})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundSize: '250%',
                }}
              />
            )}
            <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <Rotate3d className="h-4 w-4 mr-1" /> 360° 旋转展示中
            </div>
          </div>

          {/* Thumbnails / Rotation Slider */}
          <div className="flex space-x-4 overflow-x-auto py-2">
            {product.gallery.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 border-2 flex-shrink-0 ${activeImageIndex === idx ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-stone-400">拖动下方进度条或点击图片可查看不同角度细节</p>
          <input 
            type="range" 
            min="0" 
            max={product.gallery.length - 1} 
            value={activeImageIndex}
            onChange={(e) => setActiveImageIndex(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
        </div>

        {/* Right: Info & Purchase */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-stone-500">编号: {product.id}</span>
              <div className="flex text-gold-500">
                {'★★★★★'.split('').map((s,i) => <span key={i}>{s}</span>)}
              </div>
            </div>
          </div>

          <div className="border-t border-b border-stone-200 py-6">
            <p className="text-4xl text-gold-700 font-serif font-bold">¥{product.price}</p>
            <p className="text-stone-500 mt-2 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
               {isOutOfStock ? (
                 <span className="flex items-center text-red-600 font-bold text-sm">
                   <PackageX className="h-4 w-4 mr-1" /> 暂时缺货 (Out of Stock)
                 </span>
               ) : (
                 <span className="flex items-center text-green-700 font-bold text-sm">
                   <PackageCheck className="h-4 w-4 mr-1" /> 库存充足: {product.stock}件
                 </span>
               )}
            </div>
             <button 
               onClick={handleAddToCart}
               disabled={isOutOfStock}
               className={`w-full h-14 text-lg tracking-widest transition-colors flex items-center justify-center space-x-2 ${
                 isOutOfStock 
                 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                 : 'bg-stone-900 text-white hover:bg-gold-600'
               }`}
             >
               <ShoppingCart className="h-5 w-5" />
               <span>{isOutOfStock ? '缺货登记' : '立即购买'}</span>
             </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center text-xs text-stone-600">
              <ShieldCheck className="h-5 w-5 text-gold-500 mr-2" />
              <div>
                <p className="font-bold">正品保证</p>
                <p>手工镶嵌 5A级水钻</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-stone-600">
              <Truck className="h-5 w-5 text-gold-500 mr-2" />
              <div>
                <p className="font-bold">顺丰包邮</p>
                <p>包含运费险 破损包赔</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;