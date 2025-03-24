import React from 'react';
import s from '../style.module.less';
import { Card, DotLoading } from 'antd-mobile';

const OverviewCard = ({ loading, totalExpense, recordCount }) => {
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
            <div className={s.title}>本月总支出</div>
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