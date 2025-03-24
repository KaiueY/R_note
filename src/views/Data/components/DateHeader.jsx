import React from 'react';
import s from '../style.module.less';
import CustomIcon from '@/components/CustomIcon';

const DateHeader = ({ currentDate, onDateClick }) => {
  // 格式化日期显示
  const formatDate = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}年${month}月`;
  };

  return (
    <div className={s.header}>
      <div className={s.date} onClick={onDateClick}>
        <span>{formatDate()}</span>
        <CustomIcon type="note-xiangxiajiantoushixin" />
      </div>
    </div>
  );
};

export default DateHeader;