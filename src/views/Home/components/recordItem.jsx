import React, { useState } from "react";
import s from './recordItem.module.less';
import CustomIcon from '@/components/CustomIcon';
import formatTime from "@/utils/formatTime";
import { SwipeAction } from 'antd-mobile';
import BillDetail from './BillDetail';
// 类型图标映射
const typeIconMap = {
  Food: 'note-food',
  Transport: 'note-transport',
  Entertainment: 'note-entertainment',
  Shopping: 'note-shopping',
  Medical: 'note-medical',
  Education: 'note-education',
  Housing: 'note-housing',
  Utilities: 'note-utilities',
  Travel: 'note-travel',
  Other: 'note-bill',
  default: 'note-bill'
};

// 支付方式图标映射
const payTypeIconMap = {
  cash: 'note-cash',
  credit: 'note-credit-card',
  debit: 'note-bank-card',
  alipay: 'note-alipay',
  wechat: 'note-wechat',
  default: 'note-wallet'
};

const RecordItem = ({ bill, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false);
  // 使用默认值避免空值错误
  const {
    id,
    amount = '0.00',
    date = Date.now(),
    pay_type = 'cash',
    remark = '无备注',
    typeName = 'default',
    type = 0,
    typeIcon = 'note-bill'
  } = bill || {};



  // 获取图标
  const getTypeIcon = (icon) => {
    return icon || typeIconMap.default;
  };

  return (
    <>
      <SwipeAction
        rightActions={[
          {
            key: 'delete',
            text: '删除',
            color: 'danger',
            onClick: () => onDelete && onDelete(id)
          }
        ]}
      >
        <div className={s.item} onClick={() => setShowDetail(true)}>
          <div className={s.left}>
            <div className={s.icon}>
              <CustomIcon type={getTypeIcon(typeIcon)} />
            </div>
            <div className={s.content}>
              <div className={s.title}>{typeName}</div>
              <div className={s.time}>{formatTime(date)}</div>
            </div>
          </div>
          <div className={s.right}>
            ${amount}
          </div>
        </div>
      </SwipeAction>
      <BillDetail
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        bill={bill}
      />
    </>
  );
};

export default RecordItem;