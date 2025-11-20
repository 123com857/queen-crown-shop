import React from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CheckCircle, AlertTriangle, Copy } from 'lucide-react';

const Payment = () => {
  const { orderId } = useParams();
  const { orders, paymentAccounts } = useShop();
  const order = orders.find(o => o.id === orderId);

  if (!order) return <div>Order not found</div>;

  // Filter accounts based on selection, or show banks as fallback
  const activeAccounts = paymentAccounts.filter(acc => 
    order.paymentMethod === 'bank' ? acc.type === 'bank' : acc.type === order.paymentMethod
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`已复制: ${text}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-serif text-stone-900 mb-2">订单提交成功！</h1>
        <p className="text-stone-600">订单号: <span className="font-mono font-bold">{order.id}</span></p>
        <p className="text-xl mt-4 font-bold">需付金额: <span className="text-red-600">¥{order.totalAmount.toFixed(2)}</span></p>
      </div>

      <div className="bg-white border-l-4 border-gold-500 p-6 shadow-md mb-8">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-gold-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-stone-900 mb-1">转账说明</h3>
            <p className="text-sm text-stone-600">
              请务必在转账备注中填写您的<span className="font-bold text-red-600">手机号后四位</span>或<span className="font-bold text-red-600">订单号</span>，以便财务快速核对入账。
              核对无误后，我们将于24小时内安排顺丰发货。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeAccounts.map((acc, idx) => (
          <div key={idx} className="bg-stone-50 p-6 rounded-lg border border-stone-200 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase bg-stone-200 px-2 py-1 rounded">{acc.type === 'bank' ? '银行卡' : acc.type}</span>
                <span className="text-sm text-stone-400">收款账户 {idx + 1}</span>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-stone-500">收款人姓名</p>
                <div className="flex items-center justify-between bg-white p-2 border border-stone-100">
                    <span className="font-bold text-lg">{acc.name}</span>
                    <button onClick={() => copyToClipboard(acc.name)} className="text-gold-600 hover:text-gold-800"><Copy className="h-4 w-4"/></button>
                </div>
              </div>

              <div>
                <p className="text-sm text-stone-500">收款账号</p>
                <div className="flex items-center justify-between bg-white p-2 border border-stone-100">
                    <span className="font-mono text-lg font-bold tracking-wide text-blue-900">{acc.account}</span>
                    <button onClick={() => copyToClipboard(acc.account)} className="text-gold-600 hover:text-gold-800"><Copy className="h-4 w-4"/></button>
                </div>
              </div>

              {acc.bankName && <p className="text-sm text-stone-500 mt-1">开户行: {acc.bankName}</p>}
            </div>

            {acc.qrCode && (
              <div className="flex-shrink-0 text-center">
                <div className="bg-white p-2 border border-stone-200">
                  <img src={acc.qrCode} alt="QR Code" className="w-32 h-32 object-cover" />
                </div>
                <p className="text-xs mt-2 text-stone-500">扫码支付</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="text-stone-500 hover:text-stone-900 underline text-sm">
          我已转账，联系客服催发货
        </button>
      </div>
    </div>
  );
};

export default Payment;