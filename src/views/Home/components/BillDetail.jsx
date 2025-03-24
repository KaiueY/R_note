import React from 'react';
import { List, Popup } from 'antd-mobile';
import s from './billDetail.module.less';
import CustomIcon from '@/components/CustomIcon';
import formatTime from '@/utils/formatTime';

// 支付方式图标映射
const payTypeIconMap = {
  cash: 'note-cash',
  credit: 'note-credit-card',
  debit: 'note-bank-card',
  alipay: 'note-alipay',
  wechat: 'note-wechat',
  default: 'note-wallet'
};

const BillDetail = ({ bill, visible, onClose }) => {
  if (!bill) return null;

  const {
    amount = '0.00',
    date = Date.now(),
    pay_type = 'cash',
    remark = '无备注',
    typeName = '其他',
    type = 0,
    typeIcon = 'note-bill'
  } = bill || {};

  // 获取支付方式图标
  const getPayTypeIcon = (payType) => {
    return payTypeIconMap[payType] || payTypeIconMap.default;
  };

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
      <div className={s.billDetail}>
        <div className={s.header}>
          <div className={s.closeButton} onClick={onClose}>
            <CustomIcon type="note-close" />
          </div>
          <h2>账单详情</h2>
        </div>

        <List className={s.detailList}>
          <List.Item
            prefix={<div className={s.label}>金额</div>}
            extra={<div className={s.amount}>${amount}</div>}
          />
          <List.Item
            prefix={<div className={s.label}>类型</div>}
            extra={typeName}
          />
          <List.Item
            prefix={<div className={s.label}>时间</div>}
            extra={formatTime(date)}
          />
          <List.Item
            prefix={<div className={s.label}>支付方式</div>}
            extra={
              <div className={s.payType}>
                <CustomIcon type={getPayTypeIcon(pay_type)} />
                <span>{pay_type}</span>
              </div>
            }
          />
          <List.Item
            prefix={<div className={s.label}>备注</div>}
            extra={remark}
          />
        </List>
      </div>
    </Popup>
  );
};

export default BillDetail;