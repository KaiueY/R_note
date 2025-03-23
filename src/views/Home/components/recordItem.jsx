import React from "react";
import s from './recordItem.module.less';
import CustomIcon from '@/components/CustomIcon';
import formatTime from "@/utils/formatTime";
// 类型图标映射
const typeIconMap = {
  food: 'note-food',
  shopping: 'note-shopping',
  transport: 'note-transport',
  entertainment: 'note-entertainment',
  medical: 'note-medical',
  salary: 'note-salary',
  transfer: 'note-transfer',
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
  // 使用默认值避免空值错误
  const {
    id,
    amount = '0.00',
    date = Date.now(),
    pay_type = 'cash',
    remark = '无备注',
    type_name = 'default',
    type_id = 0
  } = bill || {};



  // 获取图标
  const getTypeIcon = (typeName) => {
    return typeIconMap[typeName] || typeIconMap.default;
  };

  return (
    <div className={s.item}>
      <div className={s.left}>
        <div className={s.icon}>
          <CustomIcon type={getTypeIcon(type_name)} />
        </div>
        <div className={s.content}>
          <div className={s.title}>{type_name}</div>
          <div className={s.time}>{formatTime(date)}</div>
        </div>
      </div>
      <div className={s.right}>
        ${amount}
      </div>
    </div>
  );
};

export default RecordItem;