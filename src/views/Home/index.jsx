import React, { useState, useRef, useEffect } from "react";
import s from "./style.module.less";
import CustomIcon from '@/components/CustomIcon';
import Card from "./components/Card";
import RecordItem from "./components/recordItem";
import AddBillPopup from "./components/AddBillPopup";
import BillVirtualListExample from "./components/BillVirtualListExample";
import { Calendar, Popup, Tabs, Toast, DotLoading, FloatingBubble } from 'antd-mobile';
import { useHeader } from './hooks/useHeader';
import { useDatePicker } from './hooks/useDatePicker';
import { useBillData } from './hooks/useBillData';
import { useCardData } from './hooks/useCardData';

const Home = () => {
  // 添加账单弹窗状态
  const [addBillVisible, setAddBillVisible] = useState(false);
  
  // 拖拽相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [expandedView, setExpandedView] = useState(false);
  const dragHandleRef = useRef(null);

  // 使用卡片数据钩子
  const {
    loading: cardsLoading,
    cards,
    error: cardsError,
    removeCard
  } = useCardData();

  const handleCardAnimationComplete = (cardId) => {
    // 移除已完成动画的卡片
    removeCard(cardId);
  };
  
  const handlePaymentComplete = (billData) => {
    // 不再调用addBill，因为billService.processCardPayment已经发送了请求
    // addBill(billData);
    // 显示支付成功提示
    Toast.show({
      icon: 'success',
      content: '支付成功',
    });
    
    // 直接刷新账单数据
    fetchBillData(currentDate);
  };
  
  // 处理删除账单
  const handleDeleteBill = async (id) => {
    try {
      await deleteBill(id);
      Toast.show({
        icon: 'success',
        content: '删除成功',
      });
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '删除失败',
      });
    }
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
    addBill,
    deleteBill,
    fetchBillData
  } = useBillData(currentDate);

  // 显示错误提示
  useEffect(() => {
    if (error) {
      Toast.show({
        icon: 'fail',
        content: error,
      });
    }
    
    if (cardsError) {
      Toast.show({
        icon: 'fail',
        content: cardsError,
      });
    }
  }, [error, cardsError]);

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
                <span>Current Balance</span>
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

        {/* 交易记录列表 - 使用虚拟列表优化性能 */}
        <div className={s.transactions}>
          <BillVirtualListExample
            loading={loading}
            billList={billList}
            onDeleteBill={handleDeleteBill}
            style={{ height: '100%' }}
          />
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
        
        {/* 添加账单按钮 */}
        <FloatingBubble
          onClick={() => setAddBillVisible(true)}
          className={s.add_bill_button}
        >
          <CustomIcon type="note-add" />
        </FloatingBubble>
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
      
      {/* 添加账单弹窗 */}
      <AddBillPopup 
        visible={addBillVisible} 
        onClose={() => setAddBillVisible(false)} 
        onSuccess={() => {
          // 刷新账单数据
          fetchBillData(currentDate);
        }}
      />
    </div>
  );
};

export default Home;