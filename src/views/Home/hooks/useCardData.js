import { useState, useEffect } from 'react';
import { billService } from '@/api/services';

export const useCardData = () => {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  // 获取卡片数据
  const fetchCardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 调用接口获取数据
      const response = await billService.getCards();
      
      // 检查响应状态
      if (response.status !== 'success') {
        throw new Error('获取卡片数据失败');
      }
      
      // 设置卡片数据
      setCards(response.data || []);
    } catch (err) {
      console.error('获取卡片数据失败:', err);
      setError('获取卡片数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 移除卡片
  const removeCard = (cardId) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };

  // 添加卡片（通常在支付完成后不会立即添加新卡片，但提供此方法以备不时之需）
  const addCard = (cardData) => {
    setCards(prevCards => [...prevCards, { ...cardData, id: Date.now() }]);
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchCardData();
  }, []);

  return {
    loading,
    cards,
    error,
    fetchCardData,
    removeCard,
    addCard
  };
};