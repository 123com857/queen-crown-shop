export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number; // 1688 Cost for profit calculation
  category: string;
  description: string;
  mainImage: string;
  gallery: string[]; // For 360 view simulation
  rating: number;
  sales: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PENDING_PAYMENT = '待转账',
  PAID_VERIFYING = '查帐中',
  PROCESSING = '待发货',
  SHIPPED = '已发货',
  COMPLETED = '已完成',
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  totalCost: number;
  profit: number;
  status: OrderStatus;
  createdAt: number;
  paymentMethod: 'bank' | 'alipay' | 'wechat';
}

export interface PaymentAccount {
  type: 'bank' | 'alipay' | 'wechat';
  name: string;
  account: string;
  bankName?: string;
  qrCode?: string; // URL to image
}