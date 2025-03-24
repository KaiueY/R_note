import { useState, useEffect } from 'react';
import axios from '@/utils/axios';

export const useTrendData = (date) => {
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 获取近6个月的数据
    const fetchTrendData = async () => {
      setLoading(true);
      try {
        // 获取当前月份和前5个月的数据
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const monthsData = [];
        for (let i = 5; i >= 0; i--) {
          let targetMonth = month - i;
          let targetYear = year;
          
          if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
          }
          
          const response = await axios.get('/api/bill', {
            params: { year: targetYear, month: targetMonth }
          });
          
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
        
        setTrendData(monthsData);
      } catch (error) {
        console.error('获取趋势数据失败:', error);
        setError('获取趋势数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendData();
  }, [date]);

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
        type: 'value'
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