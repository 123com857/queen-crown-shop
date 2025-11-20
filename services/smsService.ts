// Simulate sending an SMS via Jiguang or Yunpian
export const sendSMS = async (phone: string, type: 'ORDER_CREATED' | 'ORDER_SHIPPED', params: any) => {
  console.log(`[SMS SERVICE] Sending to ${phone}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let content = '';
  if (type === 'ORDER_CREATED') {
    content = `【RoyalCrown】尊贵的顾客，您的订单 ${params.orderId} 已提交成功。请尽快完成转账以便发货。`;
  } else if (type === 'ORDER_SHIPPED') {
    content = `【RoyalCrown】您的宝贝已发货！快递单号：${params.tracking}，请注意查收。`;
  }

  // In a real app, this would be: axios.post('https://sms.yunpian.com/v2/sms/single_send.json', ...)
  console.log(`[SMS SENT] Content: ${content}`);
  return true;
};