import React, { useMemo } from 'react';
import VirtualList from './index';
import styles from './billVirtualList.module.less';

/**
 * 账单虚拟列表组件
 * 专门用于渲染按日期分组的账单数据
 * @param {Array} billList - 按日期分组的账单数据
 * @param {Function} renderBillItem - 渲染每个账单项的函数
 * @param {Function} renderDateHeader - 渲染日期标题的函数（可选）
 * @param {Object} style - 自定义样式
 * @param {String} className - 自定义类名
 * @param {Number} dateHeaderHeight - 日期标题的高度
 * @param {Number} billItemHeight - 账单项的高度
 * @param {Number} bufferSize - 缓冲区大小
 */
const BillVirtualList = ({
  billList = [],
  renderBillItem,
  renderDateHeader,
  style = {},
  className = '',
  dateHeaderHeight = 40,
  billItemHeight = 60,
  bufferSize = 5,
  onDeleteBill,
}) => {
  // 将按日期分组的数据转换为扁平结构，同时保留日期信息
  const flattenedData = useMemo(() => {
    const result = [];
    
    billList.forEach(dayItem => {
      // 添加日期标题项
      result.push({
        type: 'header',
        date: dayItem.date,
        data: dayItem,
      });
      
      // 添加该日期下的所有账单项
      dayItem.bills.forEach(bill => {
        result.push({
          type: 'bill',
          date: dayItem.date,
          data: bill,
        });
      });
    });
    
    return result;
  }, [billList]);

  // 计算每一项的高度
  const getItemHeight = (index) => {
    const item = flattenedData[index];
    return item.type === 'header' ? dateHeaderHeight : billItemHeight;
  };

  // 获取每一项的唯一key
  const getItemKey = (item) => {
    return item.type === 'header' 
      ? `header-${item.date}` 
      : `bill-${item.data.id}`;
  };

  // 渲染每一项
  const renderItem = (item, index) => {
    if (item.type === 'header') {
      // 渲染日期标题
      return renderDateHeader ? (
        renderDateHeader(item.date)
      ) : (
        <div className={styles.dateHeader}>
          <div className={styles.date}>{item.date}</div>
          <div className={styles.divider}></div>
        </div>
      );
    } else {
      // 渲染账单项
      return renderBillItem(item.data, onDeleteBill);
    }
  };

  return (
    <VirtualList
      data={flattenedData}
      renderItem={renderItem}
      itemHeight={getItemHeight}
      bufferSize={bufferSize}
      className={className}
      style={style}
      getKey={getItemKey}
    />
  );
};

export default BillVirtualList;