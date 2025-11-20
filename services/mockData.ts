import { Product } from '../types';

const CATEGORIES = ['皇冠', '发箍', '发梳', '耳饰套装', '森系头花'];
const ADJECTIVES = ['奢华', '法式', '复古', '巴洛克', '闪耀', '水晶', '手工', '宫廷'];
const NOUNS = ['女王皇冠', '公主发冠', '新娘头饰', '水钻发带', '珍珠发箍'];

const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    
    // Simulate pricing: Price is 3x-5x cost (Standard Dropshipping Markups)
    const cost = Math.floor(Math.random() * 50) + 20; // 20-70 RMB cost
    const price = Math.floor(cost * (3 + Math.random() * 2)); 

    // Use picsum with different sig to avoid caching same image
    const imageId = 100 + i;
    
    products.push({
      id: `PROD-${1000 + i}`,
      name: `${adj}${category} - ${noun} ${202500 + i}款`,
      price,
      cost,
      category,
      description: `2025年新款${adj}设计，采用进口5A级水钻，纯手工镶嵌。适合婚礼、晚宴、演出等隆重场合。360度无死角闪耀，灯光下效果极佳。`,
      mainImage: `https://picsum.photos/id/${imageId % 80 + 100}/800/800`,
      gallery: [
        `https://picsum.photos/id/${imageId % 80 + 100}/800/800`,
        `https://picsum.photos/id/${(imageId + 1) % 80 + 100}/800/800`,
        `https://picsum.photos/id/${(imageId + 2) % 80 + 100}/800/800`,
        `https://picsum.photos/id/${(imageId + 3) % 80 + 100}/800/800`,
      ],
      rating: 4.5 + Math.random() * 0.5,
      sales: Math.floor(Math.random() * 5000) + 100,
      stock: Math.floor(Math.random() * 50), // Random stock 0-49
    });
  }
  return products;
};

export const PRODUCTS = generateProducts(220);

export const PAYMENT_ACCOUNTS = [
  { type: 'bank', name: '王*强', account: '6222 0210 0123 4567 890', bankName: '中国工商银行 (北京分行)' },
  { type: 'bank', name: '王*强', account: '6217 9910 0987 6543 210', bankName: '建设银行 (上海分行)' },
  { type: 'alipay', name: '王*强', account: '138****8888', qrCode: 'https://picsum.photos/300/300?random=1' },
  { type: 'wechat', name: 'A00-皇冠批发-强哥', account: 'wxid_crown888', qrCode: 'https://picsum.photos/300/300?random=2' },
  { type: 'bank', name: '李*梅 (财务)', account: '6228 4800 3333 4444 555', bankName: '农业银行' },
];