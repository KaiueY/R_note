// 账单相关的mock数据
import Mock from 'mockjs';

// 生成随机日期
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 生成随机金额
const getRandomAmount = (min, max) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

// 账单类型
const billTypes = [
  { id: 1, name: 'Food', icon: 'note-food' },
  { id: 2, name: 'Transport', icon: 'note-transport' },
  { id: 3, name: 'Entertainment', icon: 'note-entertainment' },
  { id: 4, name: 'Shopping', icon: 'note-shopping' },
  { id: 5, name: 'Medical', icon: 'note-medical' },
  { id: 6, name: 'Education', icon: 'note-education' },
  { id: 7, name: 'Housing', icon: 'note-housing' },
  { id: 8, name: 'Utilities', icon: 'note-utilities' },
  { id: 9, name: 'Travel', icon: 'note-travel' },
  { id: 10, name: 'Other', icon: 'note-bill' }
];

// 生成随机账单数据
const generateBillData = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const bills = [];
  
  // 生成20-30条随机账单记录
  const count = Math.floor(Math.random() * 11) + 20;
  
  for (let i = 0; i < count; i++) {
    const type = billTypes[Math.floor(Math.random() * billTypes.length)];
    const isIncome = Math.random() > 0.8; // 20%的概率是收入
    
    bills.push({
      id: `bill-${year}${month}${i}`,
      type: type.id,
      typeName: type.name,
      typeIcon: type.icon,
      amount: getRandomAmount(isIncome ? 1000 : 10, isIncome ? 10000 : 1000),
      date: getRandomDate(startDate, endDate).getTime(),
      isIncome
    });
  }
  
  // 计算总收入和支出
  const totalIncome = bills.reduce((sum, bill) => bill.isIncome ? sum + bill.amount : sum, 0);
  const totalExpense = bills.reduce((sum, bill) => !bill.isIncome ? sum + bill.amount : sum, 0);
  
  // 按类型统计金额
  const categorySummary = billTypes.map(type => ({
    type: type.name,
    amount: bills
      .filter(bill => bill.type === type.id)
      .reduce((sum, bill) => sum + bill.amount, 0)
  })).filter(category => category.amount > 0);

  return {
    status: "success",
    data: [{
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalIncome,
      totalExpense,
      totalAmount: totalIncome + totalExpense,
      recordCount: bills.length,
      categorySummary,
      list: bills
    }]
  };
};

// 导出账单相关的mock接口
const billMock = {
  // 获取账单数据
  '/api/bill': (params) => {
    const { year, month } = params;
    return generateBillData(parseInt(year), parseInt(month));
  },
  
  // 添加账单
  '/api/bill/add': (data) => ({
    status: "success",
    data: { ...data, id: `bill-${Date.now()}` }
  }),
  
  // 删除账单
  '/api/bill/delete': (id) => ({
    status: "success",
    data: null
  }),

  // 更新账单
  '/api/bill/update': (data) => ({
    status: "success",
    data: { ...data, updateTime: Date.now() }
  })
};

export default billMock;