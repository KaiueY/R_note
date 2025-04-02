// 导出数据API服务方法
import request from '../request';
import {
  export_bill,
  export_statistics
} from '../paths/export';
import exportUtils from '@/utils/exportData';

// 导出API服务
const exportService = {
  /**
   * 获取账单导出数据
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getBillExportData: (params) => {
    return request.get(export_bill, params);
  },

  /**
   * 获取统计导出数据
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getStatisticsExportData: (params) => {
    return request.get(export_statistics, params);
  },
  
  /**
   * 导出账单数据为CSV
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  exportBillToCSV: async (params) => {
    try {
      // 如果没有提供export_bill API，则使用普通bill API获取数据
      const response = await request.get('/bill', params);
      if (response && response.data) {
        // 获取账单类型数据
        const typesResponse = await request.get('/bill/types');
        const types = typesResponse?.data || [];
        
        // 格式化数据
        const formattedData = exportUtils.formatBillDataForExport(response.data, types);
        
        // 导出为CSV
        const fileName = `账单数据_${new Date().toISOString().split('T')[0]}`;
        return exportUtils.exportToCSV(formattedData, fileName, exportUtils.billExportHeaders);
      }
      return false;
    } catch (error) {
      console.error('导出账单CSV失败:', error);
      return false;
    }
  },
  
  /**
   * 导出账单数据为Excel
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  exportBillToExcel: async (params) => {
    try {
      // 如果没有提供export_bill API，则使用普通bill API获取数据
      const response = await request.get('/bill', params);
      if (response && response.data) {
        // 获取账单类型数据
        const typesResponse = await request.get('/bill/types');
        const types = typesResponse?.data || [];
        
        // 格式化数据
        const formattedData = exportUtils.formatBillDataForExport(response.data, types);
        
        // 导出为Excel
        const fileName = `账单数据_${new Date().toISOString().split('T')[0]}`;
        return exportUtils.exportToExcel(formattedData, fileName, exportUtils.billExportHeaders, '账单数据');
      }
      return false;
    } catch (error) {
      console.error('导出账单Excel失败:', error);
      return false;
    }
  }
};

export default exportService;