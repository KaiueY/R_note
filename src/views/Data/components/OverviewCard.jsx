import React from 'react';
import s from '../style.module.less';
import { Card, DotLoading } from 'antd-mobile';
import CustomIcon from '@/components/CustomIcon';

const OverviewCard = ({ loading, totalExpense, recordCount, currentDate, onDateClick }) => {
  // 格式化日期显示
  const formatDate = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}年${month}月`;
  };

  return (
    <div className={s.overview}>
      <Card className={s.totalCard}>
        {loading ? (
          <div className={s.loading}>
            <DotLoading color='primary' />
            <span>加载中...</span>
          </div>
        ) : (
          <>
            <div className={s.cardHeader}>
              <div className={s.title}>本月总支出</div>
              <div className={s.date} onClick={onDateClick}>
                <span>{formatDate()}</span>
                <CustomIcon type="note-xiangxiajiantoushixin" />
              </div>
            </div>
            <div className={s.amount}>
              <span className={s.currency}>$</span>
              <span className={s.value}>
                {totalExpense.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className={s.desc}>共{recordCount || 0}笔支出</div>
          </>
        )}
      </Card>
    </div>
  );
};

export default OverviewCard;