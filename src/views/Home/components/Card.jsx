import React, { useEffect, useRef, useState } from "react";
import s from "./Card.module.less";
import { Player } from '@lordicon/react';
import pinch from '@/assets/icons/pinch.json'
import { motion, useAnimation } from 'framer-motion';
import CustomIcon from '@/components/CustomIcon';
const Card = ({
  id,
  title,
  amount,
  address,
  type,
  typeIcon,
  onAnimationComplete,
  onPaymentComplete
}) => {
  const playerRef = useRef(null);
  const controls = useAnimation();
  const cardRef = useRef(null);

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

    // 创建账单数据
    const billData = {
      type_id: type, // 使用type作为type_id发送给后端
      amount,
      date: new Date().toISOString().split('T')[0], // 格式化日期为YYYY-MM-DD
      is_income: false,
      remark: `Payment for ${title} in ${address}`,
      pay_type: 'credit'
    };

    try {
      // 发送支付请求到后端
      const response = await fetch('/api/bill/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(billData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // 动画完成后回调，传递账单数据给Home组件
        const newBill = {
          id: result.data.id || `bill-${Date.now()}`,
          type,
          typeName: title,
          typeIcon,
          amount,
          date: Date.now(),
          isIncome: false,
          pay_type: 'credit',
          remark: billData.remark
        };
        
        onPaymentComplete && onPaymentComplete(newBill);
        onAnimationComplete && onAnimationComplete(id);
      } else {
        throw new Error(result.message || '支付失败');
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
          <span>{title}</span>
          <span className={s.address}>{address}</span>
        </div>
        <div className={s.header_avatar}>
          <CustomIcon type={typeIcon || 'note-bill'} />
        </div>
      </div>
      <div className={s.card__bottom}>
        <div className={s.bottom_head}>
          <span>Upcoming Payment</span>
        </div>
        <div className={s.bottom_body}>
          <div className={s.money}>{`$`}{amount}</div>
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
