import React from "react";
import s from './recordItem.module.less';
import CustomIcon from '@/components/CustomIcon';

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

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(Number(timestamp));
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 获取图标
  const getTypeIcon = (typeName) => {
    return typeIconMap[typeName] || typeIconMap.default;
  };

  // 获取支付方式图标
  const getPayTypeIcon = (payType) => {
    return payTypeIconMap[payType] || payTypeIconMap.default;
  };

  // 处理删除
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && id) {
      onDelete(id);
    }
  };

  return (
    <div className={s.item}>
      <div className={s.left}>
        <div className={s.icon}>
          <CustomIcon type={getTypeIcon(type_name)} />
        </div>
      </div>
      <div className={s.center}>
        <div className={s.type}>{type_name}</div>
        <div className={s.remark}>{remark}</div>
      </div>
      <div className={s.right}>
        <div className={s.amount}>${amount}</div>
        <div className={s.info}>
          <span className={s.time}>{formatTime(date)}</span>
          <span className={s.payType}>
            <CustomIcon type={getPayTypeIcon(pay_type)} />
          </span>
        </div>
        <div className={s.actions}>
          <span className={s.delete} onClick={handleDelete}>
            <CustomIcon type="note-delete" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecordItem;