import React, { useState } from 'react';
import { Dialog, Button, Toast, Selector, DatePicker, Space } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import s from './ExportData.module.less';
import { exportService } from '@/api/services';

/**
 * 导出数据组件
 * @param {Object} props
 * @param {Function} props.onClose - 关闭回调函数
 */
const ExportData = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState(['excel']); // 默认导出为Excel
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [dateVisible, setDateVisible] = useState(false);
  
  // 导出类型选项
  const exportTypeOptions = [
    {
      label: 'Excel格式',
      value: 'excel',
    },
    {
      label: 'CSV格式',
      value: 'csv',
    },
  ];

  // 处理导出操作
  const handleExport = async () => {
    try {
      setLoading(true);
      
      // 准备请求参数
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      
      const params = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      };
      
      // 根据选择的导出类型执行不同的导出操作
      let success = false;
      if (exportType[0] === 'excel') {
        success = await exportService.exportBillToExcel(params);
      } else if (exportType[0] === 'csv') {
        success = await exportService.exportBillToCSV(params);
      }
      
      if (success) {
        Toast.show({
          icon: 'success',
          content: '导出成功',
        });
        onClose();
      } else {
        Toast.show({
          icon: 'fail',
          content: '导出失败，请重试',
        });
      }
    } catch (error) {
      console.error('导出失败:', error);
      Toast.show({
        icon: 'fail',
        content: '导出失败，请重试',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={true}
      content={
        <div className={s.exportContainer}>
          <div className={s.header}>
            <h3>导出账单数据</h3>
            <CloseOutline className={s.closeIcon} onClick={onClose} />
          </div>
          
          <div className={s.content}>
            <div className={s.formItem}>
              <div className={s.label}>导出格式</div>
              <Selector
                options={exportTypeOptions}
                value={exportType}
                onChange={setExportType}
                showCheckMark={false}
              />
            </div>
            
            <div className={s.formItem}>
              <div className={s.label}>选择日期范围</div>
              <Button
                className={s.dateButton}
                onClick={() => setDateVisible(true)}
                block
              >
                {dateRange[0].toLocaleDateString()} 至 {dateRange[1].toLocaleDateString()}
              </Button>
            </div>
            
            <DatePicker
              visible={dateVisible}
              onClose={() => setDateVisible(false)}
              defaultValue={dateRange[0]}
              min={new Date(2020, 0, 1)}
              max={new Date()}
              onConfirm={(val) => {
                setDateRange([val, dateRange[1]]);
                setDateVisible(false);
              }}
            />
          </div>
          
          <div className={s.footer}>
            <Space block justify="center">
              <Button onClick={onClose}>取消</Button>
              <Button color="primary" loading={loading} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </div>
        </div>
      }
      closeOnAction
      closeOnMaskClick
    />
  );
};

export default ExportData;