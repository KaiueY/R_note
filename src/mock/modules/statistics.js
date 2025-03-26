// 统计相关的mock数据
import Mock from 'mockjs';

// 生成随机统计数据
const generateStatisticsData = (year, month) => {
  const Random = Mock.Random;
  
  // 生成每日消费数据
  const dailyExpenses = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    dailyExpenses.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      amount: Random.float(10, 500, 2, 2)
    });
  }
  
  // 生成消费类型占比
  const expenseTypes = [
    { type: 'Food', percentage: Random.float(10, 40, 1, 1) },
    { type: 'Transport', percentage: Random.float(5, 20, 1, 1) },
    { type: 'Entertainment', percentage: Random.float(5, 25, 1, 1) },
    { type: 'Shopping', percentage: Random.float(10, 30, 1, 1) },
    { type: 'Others', percentage: Random.float(5, 15, 1, 1) }
  ];
  
  // 确保百分比总和为100
  const totalPercentage = expenseTypes.reduce((sum, item) => sum + item.percentage, 0);
  expenseTypes.forEach(item => {
    item.percentage = Number((item.percentage / totalPercentage * 100).toFixed(1));
  });
  
  // 生成月度消费趋势（近6个月）
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    let trendMonth = month - i;
    let trendYear = year;
    
    if (trendMonth <= 0) {
      trendMonth += 12;
      trendYear -= 1;
    }
    
    monthlyTrend.push({
      month: `${trendYear}-${String(trendMonth).padStart(2, '0')}`,
      amount: Random.float(1000, 5000, 2, 2)
    });
  }
  
  return {
    status: "success",
    data: {
      dailyExpenses,
      expenseTypes,
      monthlyTrend,
      totalExpense: dailyExpenses.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
      averageDailyExpense: (dailyExpenses.reduce((sum, item) => sum + item.amount, 0) / daysInMonth).toFixed(2)
    }
  };
};

// 导出统计相关的mock接口
const statisticsMock = {
  // 获取统计数据
  '/api/statistics': (params) => {
    const { year, month } = params;
    return generateStatisticsData(parseInt(year), parseInt(month));
  },
  
  // 获取消费趋势
  '/api/statistics/trend': (params) => {
    const { year, month } = params;
    const data = generateStatisticsData(parseInt(year), parseInt(month));
    return {
      status: "success",
      data: data.data.monthlyTrend
    };
  },
  
  // 获取消费类型占比
  '/api/statistics/types': (params) => {
    const { year, month } = params;
    const data = generateStatisticsData(parseInt(year), parseInt(month));
    return {
      status: "success",
      data: data.data.expenseTypes
    };
  }
};

export default statisticsMock;