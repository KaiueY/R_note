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
  { id: 1, name: '餐饮', icon: 'note-food' },
  { id: 2, name: '购物', icon: 'note-shopping' },
  { id: 3, name: '交通', icon: 'note-transport' },
  { id: 4, name: '娱乐', icon: 'note-entertainment' },
  { id: 5, name: '工资', icon: 'note-salary' },
  { id: 6, name: '理财', icon: 'note-investment' }
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
    const isIncome = type.id > 4; // 收入类型
    
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
  
  return {
    list: bills,
    totalIncome,
    totalExpense
  };
};

// 用户信息数据
const userInfo = {
  id: 'user123',
  username: '测试用户',
  avatar: 'https://avatars.githubusercontent.com/u/1',
  email: 'test@example.com'
};

export const mockData = {
  // 获取账单数据
  '/api/bill': (params) => {
    const { year, month } = params;
    return generateBillData(year, month);
  },
  
  // 获取用户信息
  '/userInfo': () => userInfo,
  
  // 添加账单
  '/api/bill/add': (data) => ({
    success: true,
    data: { ...data, id: `bill-${Date.now()}` }
  }),
  
  // 删除账单
  '/api/bill/delete': (id) => ({
    success: true
  })
};