import React, { useState } from 'react';
import s from './style.module.less';
import { DatePicker, Tabs } from 'antd-mobile';
import DateHeader from './components/DateHeader';
import OverviewCard from './components/OverviewCard';
import ExpenseCharts from './components/ExpenseCharts';
import TrendChart from './components/TrendChart';
import { useBillData } from './hooks/useBillData';

const Data = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('expense');
  
  // 使用自定义hook获取账单数据
  const {
    loading,
    billData,
    totalExpense,
    recordCount,
    error
  } = useBillData(currentDate);

  // 处理日期选择
  const handleDateSelect = (date) => {
    setCurrentDate(date);
    setDateVisible(false);
  };
  
  // 处理日期点击
  const handleDateClick = () => {
    setDateVisible(true);
  };

  return (
    <div className={s.data}>

      {/* 统计卡片 */}
      <OverviewCard 
        loading={loading} 
        totalExpense={totalExpense} 
        recordCount={recordCount} 
        currentDate={currentDate} 
        onDateClick={handleDateClick} 
      />
      {/* 图表类型选择 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className={s.tabs}
      >
        <Tabs.Tab title="支出分析" key="expense">
          <ExpenseCharts 
            loading={loading} 
            categorySummary={billData?.categorySummary || []} 
          />
        </Tabs.Tab>
        <Tabs.Tab title="收支趋势" key="trend">
          <div className={s.chartContainer}>
            <TrendChart currentDate={currentDate} />
          </div>
        </Tabs.Tab>
      </Tabs>

      {/* 日期选择器弹窗 */}
      <DatePicker
        visible={dateVisible}
        onClose={() => setDateVisible(false)}
        precision="month"
        value={currentDate}
        onConfirm={handleDateSelect}
        min={new Date(2020, 0, 1)}
        max={new Date()}
      />

      {/* 底部导航栏由App.jsx全局提供 */}
    </div>
  );
};



export default Data;