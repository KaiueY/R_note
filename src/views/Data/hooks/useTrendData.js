import { useState, useEffect } from 'react';
import { billService } from '@/api/services';

export const useTrendData = (startDate, endDate) => {
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 获取指定日期范围的数据
    const fetchTrendData = async () => {
      setLoading(true);
      try {
        // 计算开始日期和结束日期之间的月份差
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth() + 1;
        
        // 计算总月份数
        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
        
        const monthsData = [];
        
        // 遍历日期范围内的每个月份
        for (let i = 0; i < totalMonths; i++) {
          let targetMonth = startMonth + i;
          let targetYear = startYear;
          
          // 处理月份溢出
          while (targetMonth > 12) {
            targetMonth -= 12;
            targetYear += 1;
          }
          
          const response = await billService.getBill({ year: targetYear, month: targetMonth });
          
          if (response.data.status === 'success') {
            const data = response.data.data[0] || {};
            const totalExpense = data.list?.reduce((sum, bill) => !bill.isIncome ? sum + bill.amount : sum, 0) || 0;
            const totalIncome = data.list?.reduce((sum, bill) => bill.isIncome ? sum + bill.amount : sum, 0) || 0;
            
            monthsData.push({
              month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
              expense: totalExpense,
              income: totalIncome
            });
          }
        }
        
        // 按时间顺序排序数据
        monthsData.sort((a, b) => {
          return new Date(a.month) - new Date(b.month);
        });
        
        setTrendData(monthsData);
      } catch (error) {
        console.error('获取趋势数据失败:', error);
        setError('获取趋势数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendData();
  }, [startDate, endDate]);

  // 生成趋势图配置
  const getTrendOption = () => {
    if (!trendData.length) return {};
    
    return {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const income = params[0].data;
          const expense = params[1].data;
          return `${params[0].axisValue}<br/>收入: $${income.toFixed(2)}<br/>支出: $${expense.toFixed(2)}`;
        }
      },
      legend: {
        data: ['收入', '支出'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendData.map(item => item.month)
      },
      yAxis: {
        type: 'value',
        // 动态计算刻度值间隔
        axisLabel: {
          formatter: (value) => {
            return value.toFixed(2);
          }
        },
        // 根据数据范围动态设置刻度间隔
        splitNumber: 5,
        // 确保从0开始
        min: 0,
        // 动态计算最大值，留出一定空间
        max: function(value) {
          return Math.ceil(value.max * 1.1);
        }
      },
      series: [
        {
          name: '收入',
          type: 'line',
          stack: 'Total',
          data: trendData.map(item => item.income),
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#4caf50'
          }
        },
        {
          name: '支出',
          type: 'line',
          stack: 'Total',
          data: trendData.map(item => item.expense),
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#ff9800'
          }
        }
      ]
    };
  };

  return {
    loading,
    trendData,
    error,
    getTrendOption
  };
};