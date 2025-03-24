import { useState, useEffect } from 'react';
import axios from '@/utils/axios';

export const useBillData = (date) => {
  const [loading, setLoading] = useState(true);
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState(null);

  // 获取账单数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const response = await axios.get('/api/bill', {
        params: { year, month }
      });
      
      if (response.data.status === 'success') {
        setBillData(response.data.data[0] || {});
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      setError('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 日期变化时重新获取数据
  useEffect(() => {
    fetchData();
  }, [date]);

  // 计算总支出
  const totalExpense = billData?.list?.reduce(
    (sum, bill) => !bill.isIncome ? sum + bill.amount : sum, 0
  ) || 0;

  // 计算记录数量
  const recordCount = billData?.recordCount || 0;

  return {
    loading,
    billData,
    totalExpense,
    recordCount,
    error,
    fetchData
  };
};