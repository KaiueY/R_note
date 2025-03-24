import React, { useState, useRef, useEffect } from "react";
import s from "./style.module.less";
import CustomIcon from '@/components/CustomIcon';
import Card from "./components/Card";
import RecordItem from "./components/recordItem";
import { Calendar, Popup, Tabs, Toast, DotLoading, FloatingBubble } from 'antd-mobile';
import { useHeader } from './hooks/useHeader';
import { useDatePicker } from './hooks/useDatePicker';
import { useBillData } from './hooks/useBillData';

const Home = () => {
  const [cards, setCards] = useState([
    { id: 1, amount: 123, title: "Food", address: "Restaurant", type: 1, typeIcon: "note-food" },
    { id: 2, amount: 45, title: "Transport", address: "Taxi", type: 2, typeIcon: "note-transport" },
    { id: 3, amount: 89, title: "Shopping", address: "Mall", type: 4, typeIcon: "note-shopping" },
    { id: 4, amount: 150, title: "Medical", address: "Hospital", type: 5, typeIcon: "note-medical" },
    { id: 5, amount: 200, title: "Housing", address: "Rent", type: 7, typeIcon: "note-housing" }
  ]);
  
  // 拖拽相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [expandedView, setExpandedView] = useState(false);
  const dragHandleRef = useRef(null);

  const handleCardAnimationComplete = (cardId) => {
    // 移除已完成动画的卡片
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };
  
  const handlePaymentComplete = (billData) => {
    // 添加新账单
    addBill(billData);
    // 显示支付成功提示
    Toast.show({
      icon: 'success',
      content: '支付成功',
    });
  };
  const {
    headerRef,
    bodyRef,
    handleScroll,
    headerState,
    showBackToTop,
    scrollToTop
  } = useHeader();
  
  // 初始化拖拽相关的事件处理
  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) return;
    
    // 获取拖动条元素（使用伪元素::before，所以我们需要监听body元素的顶部区域）
    const handleDragStart = (e) => {
      // 只有点击顶部20px区域才触发拖拽
      if (e.target === bodyElement && e.clientY - bodyElement.getBoundingClientRect().top < 20) {
        setIsDragging(true);
        setStartY(e.clientY);
        setCurrentHeight(bodyElement.getBoundingClientRect().height);
        document.body.style.cursor = 'ns-resize';
      }
    };
    
    const handleDragMove = (e) => {
      if (!isDragging) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = Math.min(
        Math.max(currentHeight + deltaY, 300), // 最小高度300px
        window.innerHeight - 100 // 最大高度为视口高度减去100px（为顶部预留空间）
      );
      
      bodyElement.style.maxHeight = `${newHeight}px`;
      
      // 如果拖动超过一定阈值，标记为展开视图
      if (newHeight > window.innerHeight * 0.7) {
        setExpandedView(true);
      } else {
        setExpandedView(false);
      }
    };
    
    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = '';
      }
    };
    
    // 添加事件监听
    bodyElement.addEventListener('mousedown', handleDragStart);
    bodyElement.addEventListener('touchstart', handleDragStart, { passive: false });
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    
    return () => {
      // 移除事件监听
      bodyElement.removeEventListener('mousedown', handleDragStart);
      bodyElement.removeEventListener('touchstart', handleDragStart);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, startY, currentHeight, bodyRef]);

  const {
    visible,
    setVisible,
    activeTab,
    setActiveTab,
    currentDate,
    toggleDatePicker,
    formatDate,
    handleDateSelect
  } = useDatePicker();

  // 使用账单数据钩子
  const {
    loading,
    billList,
    totalIncome,
    totalExpense,
    error,
    addBill
  } = useBillData(currentDate);

  // 显示错误提示
  if (error) {
    Toast.show({
      icon: 'fail',
      content: error,
    });
  }

  return (
    <div className={s.home}>
      {/* 头部区域 - 滚动时逐渐隐藏 */}
      <div 
        ref={headerRef}
        className={`${s.home__header} ${s[headerState]}`}
      >
        <div className={s.header__top}>
            <div className={s.search}>
                <CustomIcon type='note-search'/>
            </div>
            <div className={s.user}>
                <span>我的账本</span>
                <CustomIcon type='note-xiangxiajiantoushixin'/>
            </div>
            <div className={s.bell}>
                <CustomIcon type='note-bell'/>
            </div>
        </div>
        <div className={s.header__main}>
            <div className={s.balance__current}>
                <span>当前余额</span>
                <div className={s.balance}>${(totalIncome - totalExpense).toFixed(2)}</div>
            </div>
          <div className={s.header__stats}>
            <div className={s.stats__spend}>
                <div className={s.spent}>${totalExpense.toFixed(2)}</div>
                <span>Spent</span>
            </div>
            <div className={s.stats__received}>
                <div className={s.received}>${totalIncome.toFixed(2)}</div>
                <span>Received</span>
            </div>
          </div>
        </div>
        <div className={s.header__foot}><p>In {formatDate()}</p></div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div 
        ref={bodyRef}
        className={`${s.home__body} ${s[`body-${headerState}`]} ${expandedView ? s.expanded : ''}`}
        onScroll={handleScroll}
      >
        {/* 简略信息栏 - 贴在 home__body 上方 */}
        {/* 卡片列表 */}
        <div className={s.row}>
          {cards.map(card => (
            <Card
              key={card.id}
              {...card}
              onAnimationComplete={handleCardAnimationComplete}
              onPaymentComplete={handlePaymentComplete}
            />
          ))}
        </div>

        {/* 交易记录列表 */}
        <div className={s.transactions}>
          {loading ? (
            <div className={s.loadingContainer}>
              <DotLoading color='primary' />
              <span>加载中...</span>
            </div>
          ) : billList.length > 0 ? (
            billList.map((dayItem, dayIndex) => (
              <div key={dayIndex} className={s.dayGroup}>
                <div className={s.dateHeader}>
                  <div className={s.date}>{dayItem.date}</div>
                  <div className={s.divider}></div>
                </div>
                {dayItem.bills.map(bill => (
                  <RecordItem key={bill.id} bill={bill} />
                ))}
              </div>
            ))
          ) : (
            <div className={s.emptyState}>
              <CustomIcon type="note-empty" />
              <p>暂无交易记录</p>
            </div>
          )}
        </div>

        {/* 回到顶部按钮 */}
        {showBackToTop && (
          <FloatingBubble
            onClick={scrollToTop}
            className={s.back_to_top}
          >
            <CustomIcon type="note-xiangshang" />
          </FloatingBubble>
        )}
      </div>

      {/* 日期选择器弹窗 */}
      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyStyle={{ height: '80vh' }}
      >
        <Calendar
          selectionMode='single'
          value={currentDate}
          onChange={handleDateSelect}
          renderTop={
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <Tabs.Tab title='按月' key='month' />
              <Tabs.Tab title='按日' key='date' />
            </Tabs>
          }
        />
      </Popup>
    </div>
  );
};

export default Home;