import React from 'react';
import BillVirtualList from '@/components/VirtualList/BillVirtualList';
import RecordItem from './recordItem';
import s from '../style.module.less';
import CustomIcon from '@/components/CustomIcon';
import { DotLoading } from 'antd-mobile';

/**
 * 账单虚拟列表示例组件
 * 用于在Home组件中展示账单数据，使用虚拟列表优化性能
 */
const BillVirtualListExample = ({ 
  loading, 
  billList, 
  onDeleteBill,
  style = {}
}) => {
  // 渲染账单项
  const renderBillItem = (bill, onDelete) => {
    return <RecordItem key={bill.id} bill={bill} onDelete={onDelete} />;
  };

  // 渲染日期标题
  const renderDateHeader = (date) => {
    return (
      <div className={s.dateHeader}>
        <div className={s.date}>{date}</div>
        <div className={s.divider}></div>
      </div>
    );
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className={s.loadingContainer}>
        <DotLoading color='primary' />
        <span>加载中...</span>
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (!billList || billList.length === 0) {
    return (
      <div className={s.emptyState}>
        <CustomIcon type="note-empty" />
        <p>暂无交易记录</p>
      </div>
    );
  }

  return (
    <BillVirtualList
      billList={billList}
      renderBillItem={renderBillItem}
      renderDateHeader={renderDateHeader}
      onDeleteBill={onDeleteBill}
      style={style}
      className={s.billVirtualList}
      // 可以根据实际情况调整以下参数
      dateHeaderHeight={40}
      billItemHeight={70}
      bufferSize={5}
    />
  );
};

export default BillVirtualListExample;