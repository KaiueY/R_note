import { useState, useEffect } from 'react';
import { billService } from '@/api/services';

export const useBillData = (date) => {
  const [loading, setLoading] = useState(false);
  const [billList, setBillList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [error, setError] = useState(null);

  // 获取账单数据
  const fetchBillData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      // 根据日期格式化查询参数
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // 调用接口获取数据
      // 使用billApi而不是直接使用axios
      const response = await billService.getBill({ year, month });
      console.log({ response});
      console.log(response.data,);
      
      // 检查响应状态
      if (response.status !== 'success') {
        throw new Error('获取数据失败');
      }
      
      // 处理返回的数据
      const billData = response.data[0] || {};
      const { list = [], totalAmount = 0 } = billData;
      
      // 计算收入和支出
      const totalIncome = list.reduce((sum, bill) => bill.isIncome ? sum + bill.amount : sum, 0);
      const totalExpense = list.reduce((sum, bill) => !bill.isIncome ? sum + bill.amount : sum, 0);
      
      // 按日期分组处理数据
      const groupedData = groupByDate(list);
      
      setBillList(groupedData);
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
    } catch (err) {
      console.error('获取账单数据失败:', err);
      setError('获取账单数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 按日期分组
  const groupByDate = (list) => {
    const result = [];
    const dateMap = {};
    
    list.forEach(item => {
      // 提取日期部分
      const dateStr = new Date(Number(item.date)).toISOString().split('T')[0];
      
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: dateStr,
          bills: []
        };
        result.push(dateMap[dateStr]);
      }
      
      dateMap[dateStr].bills.push(item);
    });
    
    // 按日期倒序排列
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // 添加新账单
  const addBill = async (billData) => {
    setLoading(true);
    try {
      const response = await billService.addBill(billData);
      // 刷新数据
      fetchBillData(date);
      return response.data;
    } catch (err) {
      setError('添加账单失败，请稍后重试');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 删除账单
  const deleteBill = async (id) => {
    setLoading(true);
    try {
      await billService.deleteBill(id);
      // 刷新数据
      fetchBillData(date);
    } catch (err) {
      setError('删除账单失败，请稍后重试');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 当日期变化时重新获取数据
  useEffect(() => {
    if (date) {
      fetchBillData(date);
    }
  }, [date]);

  return {
    loading,
    billList,
    totalIncome,
    totalExpense,
    error,
    fetchBillData,
    addBill,
    deleteBill
  };
};