import React from 'react';
import s from '../style.module.less';
import { Empty, DotLoading } from 'antd-mobile';
import ReactECharts from 'echarts-for-react';
import { useTrendData } from '../hooks/useTrendData';

const TrendChart = ({ currentDate }) => {
  const { loading, trendData, error, getTrendOption } = useTrendData(currentDate);

  return (
    <>
      {loading ? (
        <div className={s.loading}>
          <DotLoading color='primary' />
          <span>加载中...</span>
        </div>
      ) : trendData.length > 0 ? (
        <>
          <div className={s.chartTitle}>近6个月收支趋势</div>
          <ReactECharts option={getTrendOption()} style={{ height: '300px' }} />
        </>
      ) : (
        <Empty description="暂无数据" />
      )}
    </>
  );
};

export default TrendChart;