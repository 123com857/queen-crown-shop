import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Package, TrendingUp, DollarSign, Copy, LayoutGrid, ClipboardList, Search } from 'lucide-react';

const Admin = () => {
  const { orders, products, updateOrderStatus, updateProductStock } = useShop();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.profit, 0);
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING_PAYMENT).length;
  const processingOrders = orders.filter(o => o.status === OrderStatus.PROCESSING).length;

  // Chart Data preparation
  const data = orders.slice(0, 10).reverse().map(o => ({
    name: o.id.slice(-4),
    amount: o.totalAmount,
    profit: o.profit
  }));

  const copyAddress = (order: any) => {
    const text = `${order.customerName}, ${order.customerPhone}, ${order.address}`;
    navigator.clipboard.writeText(text);
    alert('地址已复制，可直接粘贴至1688下单');
  };

  const handleStatusChange = (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(id, e.target.value as OrderStatus);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-gold-500 w-2 h-8 mr-3 rounded-sm"></span>
            RoyalCrown 商家控制台 (2025版)
            </h1>
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <ClipboardList className="h-4 w-4 mr-2" /> 订单管理
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-stone-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <LayoutGrid className="h-4 w-4 mr-2" /> 库存管理
                </button>
            </div>
        </div>

        {/* Stats Cards - Always visible as dashboard overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm uppercase font-bold">总营收 (Revenue)</p>
                <p className="text-2xl font-bold text-gray-800">¥{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm uppercase font-bold">净利润 (Profit)</p>
                <p className="text-2xl font-bold text-green-600">¥{totalProfit.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
            <p className="text-xs text-gray-400 mt-2">扣除1688成本后</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
             <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm uppercase font-bold">待付款</p>
                <p className="text-2xl font-bold text-red-600">{pendingOrders}</p>
              </div>
              <div className={`h-3 w-3 rounded-full ${pendingOrders > 0 ? 'bg-red-500 animate-ping' : 'bg-gray-300'}`}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
             <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm uppercase font-bold">待发货</p>
                <p className="text-2xl font-bold text-orange-600">{processingOrders}</p>
              </div>
              <Package className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>

        {activeTab === 'orders' ? (
            <>
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm h-80">
                    <h3 className="font-bold text-gray-700 mb-4">近期订单金额趋势</h3>
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#cfa03f" strokeWidth={3} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm h-80">
                    <h3 className="font-bold text-gray-700 mb-4">利润分析</h3>
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Order Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">订单管理</h3>
                    <button className="text-sm text-blue-600 hover:underline">导出Excel</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                        <tr>
                        <th className="px-6 py-4">订单号 / 时间</th>
                        <th className="px-6 py-4">客户信息</th>
                        <th className="px-6 py-4">商品详情</th>
                        <th className="px-6 py-4 text-right">实付 / 利润</th>
                        <th className="px-6 py-4">状态操作</th>
                        <th className="px-6 py-4">快捷</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(order => (
                        <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${order.status === OrderStatus.PENDING_PAYMENT ? 'bg-red-50' : ''}`}>
                            <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{order.id}</div>
                            <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                            <div className="font-bold">{order.customerName}</div>
                            <div className="text-xs">{order.customerPhone}</div>
                            <div className="text-xs text-gray-500 truncate" title={order.address}>{order.address}</div>
                            </td>
                            <td className="px-6 py-4">
                            {order.items.map((item, i) => (
                                <div key={i} className="text-xs mb-1">
                                {item.name.slice(0, 15)}... x {item.quantity}
                                </div>
                            ))}
                            </td>
                            <td className="px-6 py-4 text-right">
                            <div className="font-bold text-gray-900">¥{order.totalAmount}</div>
                            <div className="text-xs text-green-600 font-bold">+¥{order.profit}</div>
                            </td>
                            <td className="px-6 py-4">
                            <select 
                                value={order.status} 
                                onChange={(e) => handleStatusChange(order.id, e)}
                                className={`rounded border px-2 py-1 text-xs font-bold ${
                                order.status === OrderStatus.PENDING_PAYMENT ? 'text-red-600 border-red-200 bg-red-50' :
                                order.status === OrderStatus.SHIPPED ? 'text-green-600 border-green-200 bg-green-50' : 
                                'text-gray-700 border-gray-300'
                                }`}
                            >
                                {Object.values(OrderStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            </td>
                            <td className="px-6 py-4">
                            <button 
                                onClick={() => copyAddress(order)}
                                className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition-colors" 
                                title="复制地址到1688"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    {orders.length === 0 && <div className="text-center py-10 text-gray-400">暂无订单</div>}
                </div>
                </div>
            </>
        ) : (
            /* Inventory Management View */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center sticky top-0">
                    <h3 className="font-bold text-gray-800">库存管理 ({products.length}个SKU)</h3>
                    <div className="relative">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="搜索商品名称或ID..." 
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium sticky top-[73px]">
                            <tr>
                                <th className="px-6 py-4">商品图</th>
                                <th className="px-6 py-4">商品信息</th>
                                <th className="px-6 py-4">售价 / 成本</th>
                                <th className="px-6 py-4">当前库存</th>
                                <th className="px-6 py-4 text-right">状态</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.slice(0, 50).map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">
                                        <img src={product.mainImage} alt="" className="w-12 h-12 object-cover rounded border border-gray-200" />
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="font-bold text-gray-900">{product.name}</div>
                                        <div className="text-xs text-gray-400">{product.id}</div>
                                    </td>
                                    <td className="px-6 py-3 font-mono">
                                        <div>售价: ¥{product.price}</div>
                                        <div className="text-gray-400 text-xs">成本: ¥{product.cost}</div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center">
                                            <button 
                                                className="w-8 h-8 bg-gray-100 rounded-l hover:bg-gray-200 font-bold"
                                                onClick={() => updateProductStock(product.id, Math.max(0, product.stock - 1))}
                                            >-</button>
                                            <input 
                                                type="number" 
                                                className="w-16 h-8 text-center border-y border-gray-200 focus:outline-none"
                                                value={product.stock}
                                                onChange={(e) => updateProductStock(product.id, Math.max(0, parseInt(e.target.value) || 0))}
                                            />
                                            <button 
                                                className="w-8 h-8 bg-gray-100 rounded-r hover:bg-gray-200 font-bold"
                                                onClick={() => updateProductStock(product.id, product.stock + 1)}
                                            >+</button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        {product.stock > 0 ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">正常销售</span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">已售罄</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && <div className="text-center p-10 text-gray-400">未找到商品</div>}
                    {filteredProducts.length > 50 && <div className="text-center p-4 text-gray-400 text-xs">仅显示前 50 条搜索结果</div>}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;