import React, { useState } from 'react';
import s from '../style.module.less';
import { Empty, DotLoading, DatePicker, Button } from 'antd-mobile';
import ReactECharts from 'echarts-for-react';
import { useTrendData } from '../hooks/useTrendData';

const TrendChart = ({ currentDate }) => {
  // 默认开始日期为当前日期前6个月
  const getDefaultStartDate = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 5);
    return date;
  };
  
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(currentDate);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);
  
  const { loading, trendData, error, getTrendOption } = useTrendData(startDate, endDate);

  // 处理日期选择
  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setStartPickerVisible(false);
  };
  
  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    setEndPickerVisible(false);
  };
  
  // 格式化日期显示
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };
  
  return (
    <>
      <div className={s.dateRangeSelector}>
        <div className={s.chartTitle}>收支趋势分析</div>
        <div className={s.dateRange}>
          <span>日期区间：</span>
          <Button 
            size='small' 
            onClick={() => setStartPickerVisible(true)}
            className={s.dateButton}
          >
            {formatDate(startDate)}
          </Button>
          <span>至</span>
          <Button 
            size='small' 
            onClick={() => setEndPickerVisible(true)}
            className={s.dateButton}
          >
            {formatDate(endDate)}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className={s.loading}>
          <DotLoading color='primary' />
          <span>加载中...</span>
        </div>
      ) : trendData.length > 0 ? (
        <ReactECharts option={getTrendOption()} style={{ height: '300px' }} />
      ) : (
        <Empty description="暂无数据" />
      )}
      
      <DatePicker
        visible={startPickerVisible}
        onClose={() => setStartPickerVisible(false)}
        precision='month'
        value={startDate}
        onConfirm={handleStartDateConfirm}
        max={endDate}
      />
      
      <DatePicker
        visible={endPickerVisible}
        onClose={() => setEndPickerVisible(false)}
        precision='month'
        value={endDate}
        onConfirm={handleEndDateConfirm}
        min={startDate}
        max={new Date()}
      />
    </>
  );
};

export default TrendChart;