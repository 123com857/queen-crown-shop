import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Lock } from 'lucide-react';

const Checkout = () => {
  const { cart, placeOrder } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'bank'
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-500">
        <p className="text-xl mb-4">购物袋是空的</p>
        <button onClick={() => navigate('/')} className="text-gold-600 hover:underline">去逛逛</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = await placeOrder(form);
    navigate(`/payment/${orderId}`);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl mb-10 text-center">确认订单</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2 bg-white p-6 border border-stone-200 shadow-sm">
          <h2 className="font-serif text-xl mb-6 flex items-center">
            <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">1</span>
            收货信息
          </h2>
          <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
            <div>
              <label className="block text-sm text-stone-600 mb-1">收货人姓名</label>
              <input 
                required
                type="text" 
                className="w-full border-stone-300 border p-2 focus:ring-gold-500 focus:border-gold-500"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">手机号码</label>
              <input 
                required
                type="tel" 
                className="w-full border-stone-300 border p-2 focus:ring-gold-500 focus:border-gold-500"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">详细地址</label>
              <textarea 
                required
                rows={3}
                className="w-full border-stone-300 border p-2 focus:ring-gold-500 focus:border-gold-500"
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />
            </div>

            <div className="pt-6">
              <h2 className="font-serif text-xl mb-4 flex items-center">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">2</span>
                支付方式
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {['bank', 'wechat', 'alipay'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm({...form, paymentMethod: method})}
                    className={`p-3 border text-center text-sm ${form.paymentMethod === method ? 'border-gold-500 bg-gold-50 text-gold-900' : 'border-stone-200'}`}
                  >
                    {method === 'bank' && '银行转账'}
                    {method === 'wechat' && '微信支付'}
                    {method === 'alipay' && '支付宝转账'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-2 flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                平台不经手资金，直接转账至商家账户，安全无手续费
              </p>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="bg-stone-50 p-6 h-fit sticky top-24">
          <h3 className="font-serif text-lg mb-4">订单摘要</h3>
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 text-sm">
                <img src={item.mainImage} alt="" className="w-12 h-12 object-cover" />
                <div className="flex-1">
                  <p className="truncate">{item.name}</p>
                  <p className="text-stone-500">x {item.quantity}</p>
                </div>
                <p>¥{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 pt-4 flex justify-between font-bold text-xl">
            <span>总计</span>
            <span className="text-gold-700">¥{total}</span>
          </div>
          <button 
            form="checkout-form"
            type="submit"
            className="w-full bg-red-700 text-white py-3 mt-6 font-bold tracking-wider hover:bg-red-800 transition-colors shadow-lg"
          >
            提交订单
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;