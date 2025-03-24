import React from 'react';
import s from '../style.module.less';
import { Empty, DotLoading } from 'antd-mobile';
import ReactECharts from 'echarts-for-react';

const ExpenseCharts = ({ loading, categorySummary }) => {
  // 生成饼图配置
  const getPieOption = () => {
    if (!categorySummary || !categorySummary.length) return {};
    
    const data = categorySummary.map(item => ({
      value: item.amount,
      name: item.type
    }));
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      series: [
        {
          name: '支出类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            position: 'outside'
          },
          emphasis: {
            label: {
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10
          },
          data: data
        }
      ]
    };
  };

  // 生成柱状图配置
  const getBarOption = () => {
    if (!categorySummary || !categorySummary.length) return {};
    
    const data = categorySummary;
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: ${c}'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: data.map(item => item.type),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '金额',
          type: 'bar',
          barWidth: '60%',
          data: data.map(item => item.amount),
          itemStyle: {
            color: '#1677ff'
          }
        }
      ]
    };
  };

  return (
    <div className={s.chartContainer}>
      {loading ? (
        <div className={s.loading}>
          <DotLoading color='primary' />
          <span>加载中...</span>
        </div>
      ) : categorySummary?.length > 0 ? (
        <>
          <div className={s.chartTitle}>支出类型占比</div>
          <ReactECharts option={getPieOption()} style={{ height: '300px' }} />
          <div className={s.chartTitle}>支出类型对比</div>
          <ReactECharts option={getBarOption()} style={{ height: '300px' }} />
        </>
      ) : (
        <Empty description="暂无数据" />
      )}
    </div>
  );
};

export default ExpenseCharts;