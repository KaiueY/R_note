import React from 'react';
import { List, Popup } from 'antd-mobile';
import s from './categoryDetail.module.less';
import CustomIcon from '@/components/CustomIcon';

const CategoryDetail = ({ category, visible, onClose }) => {
  if (!category) return null;

  const { type, amount, bills = [] } = category;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        minHeight: '40vh'
      }}
    >
      <div className={s.categoryDetail}>
        <div className={s.header}>
          <div className={s.closeButton} onClick={onClose}>
            <CustomIcon type="note-close" />
          </div>
          <h2>{type}类别详情</h2>
        </div>

        <div className={s.summary}>
          <div className={s.title}>总支出</div>
          <div className={s.amount}>
            <span className={s.currency}>$</span>
            <span className={s.value}>{amount.toFixed(2)}</span>
          </div>
          <div className={s.count}>共{bills.length}笔支出</div>
        </div>

        <div className={s.billList}>
          <div className={s.listTitle}>账单明细</div>
          {bills.length > 0 ? (
            <List className={s.list}>
              {bills.map((bill, index) => (
                <List.Item
                  key={index}
                  prefix={
                    <div className={s.date}>
                      {new Date(Number(bill.date)).toLocaleDateString()}
                    </div>
                  }
                  extra={<div className={s.billAmount}>${bill.amount.toFixed(2)}</div>}
                >
                  <div className={s.remark}>{bill.remark || '无备注'}</div>
                </List.Item>
              ))}
            </List>
          ) : (
            <div className={s.empty}>暂无账单数据</div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default CategoryDetail;