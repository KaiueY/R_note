import React, { useState } from "react";
import s from "./style.module.less";
import CustomIcon from '@/components/CustomIcon';
import Card from "./components/Card";
import RecordItem from "./components/recordItem";
import { Calendar, Popup, Tabs, Toast, DotLoading, FloatingBubble } from 'antd-mobile';
import { useHeader } from './hooks/useHeader';
import { useDatePicker } from './hooks/useDatePicker';
import { useBillData } from './hooks/useBillData';

const Home = () => {
  const {
    headerRef,
    bodyRef,
    handleScroll,
    headerState,
    showBackToTop,
    scrollToTop
  } = useHeader();

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
                <span>支出</span>
            </div>
            <div className={s.stats__received}>
                <div className={s.received}>${totalIncome.toFixed(2)}</div>
                <span>收入</span>
            </div>
          </div>
        </div>
        <div className={s.header__foot}><p>In {formatDate()}</p></div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div 
        ref={bodyRef}
        className={`${s.home__body} ${s[`body-${headerState}`]}`}
        onScroll={handleScroll}
      >
        {/* 简略信息栏 - 贴在 home__body 上方 */}
        <div 
          className={`${s.summary_bar} ${s[`summary-${headerState}`]}`}
        >
          <div className={s.summary_stats}>
            <div className={s.summary_spent}>
              <span>Spent:</span>
              <span className={s.amount}>${totalExpense.toFixed(2)}</span>
            </div>
            <div className={s.summary_received}>
              <span>Received:</span>
              <span className={s.amount}>${totalIncome.toFixed(2)}</span>
            </div>
          </div>
          <div className={s.summary_date} onClick={toggleDatePicker}>
            <span>{formatDate()}</span>
            <CustomIcon type='note-xiangxiajiantoushixin'/>
          </div>
        </div>

        <div className={s.row}>
            <Card />
            <Card />
            <Card />
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
            style={{
              '--initial-position-bottom': '80px',
              '--initial-position-right': '24px',
              '--edge-distance': '24px',
            }}
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