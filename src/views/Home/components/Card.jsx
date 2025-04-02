import React, { useEffect, useRef, useState } from "react";
import s from "./Card.module.less";
import { Player } from '@lordicon/react';
import pinch from '@/assets/icons/pinch.json'
import { motion, useAnimation } from 'framer-motion';
import CustomIcon from '@/components/CustomIcon';
import { billService } from '@/api/services';

// 图标映射，用于显示不同类型的图标
const TYPE_ICON_MAP = {
  '餐饮': 'note-food',
  '交通': 'note-transport',
  '购物': 'note-shopping',
  '娱乐': 'note-entertainment',
  '医疗': 'note-medical',
  '住房': 'note-housing',
  '教育': 'note-education',
  '工资': 'note-salary',
  '奖金': 'note-bonus',
  '投资': 'note-investment',
  '其他收入': 'note-income',
  '其他': 'note-bill',
  'default': 'note-bill'
};

const Card = ({
  id,
  title,
  amount,
  address,
  type,
  typeIcon,
  typeName,
  totalAmount,
  isIncome,
  cardType,
  onAnimationComplete,
  onPaymentComplete
}) => {
  const playerRef = useRef(null);
  const controls = useAnimation();
  const cardRef = useRef(null);

  // 根据接口返回的数据结构适配显示内容
  const displayTitle = title || typeName || '未知类型';
  const displayAmount = amount || totalAmount || 0;
  const displayAddress = address || (cardType === 'bill_type' ? '账单类型' : 
                                    cardType === 'payment_method' ? '支付方式' : 
                                    cardType === 'pending_bill' ? '待支付' : '其他');
  const displayIcon = typeIcon || (typeName ? TYPE_ICON_MAP[typeName] || 'note-bill' : 'note-bill');

  const handlePayment = async () => {
    playerRef.current.playFromBeginning();
    
    // 获取目标位置（第一个recordItem的位置）
    const targetElement = document.querySelector('.' + s.transactions);
    if (!targetElement || !cardRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // 计算位移距离
    const deltaX = targetRect.left - cardRect.left;
    const deltaY = targetRect.top - cardRect.top;

    // 等待0.5秒后执行动画，符合需求中的动画等待时间
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 执行动画
    await controls.start({
      x: deltaX,
      y: deltaY,
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.5 }
    });

    try {
      // 使用billService处理卡片支付
      const cardData = {
        type: type,
        amount: displayAmount,
        title: displayTitle,
        address: displayAddress,
        typeIcon: displayIcon
      };
      
      const response = await billService.processCardPayment(cardData);
      
      if (response.status === 'success') {
        // 动画完成后回调，传递账单数据给Home组件
        // 注意：这里不再创建新的账单数据，而是直接使用response中的数据
        // 避免重复调用addBill
        onAnimationComplete && onAnimationComplete(id);
      } else {
        throw new Error(response.message || '支付失败');
      }
    } catch (error) {
      console.error('支付失败:', error);
      // 支付失败时恢复卡片
      controls.start({ x: 0, y: 0, scale: 1, opacity: 1 });
    }
  }

  return (
    <motion.div 
      ref={cardRef}
      className={s.card}
      animate={controls}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}>
      <div className={s.card__header}>
        <div className={s.header_content}>
          <span>{displayTitle}</span>
          <span className={s.address}>{displayAddress}</span>
        </div>
        <div className={s.header_avatar}>
          <CustomIcon type={displayIcon} />
        </div>
      </div>
      <div className={s.card__bottom}>
        <div className={s.bottom_head}>
          <span>Upcoming Payment</span>
        </div>
        <div className={s.bottom_body}>
          <div className={s.money}>{`$`}{displayAmount}</div>
          <div onClick={()=>handlePayment()} className={s.button}>
             <Player 
            ref={playerRef}
            icon={ pinch  }
        />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
