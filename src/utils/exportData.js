// 导出数据工具函数
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * 将数据导出为CSV文件
 * @param {Array} data - 要导出的数据数组
 * @param {string} fileName - 导出文件名（不含扩展名）
 * @param {Array} headers - 表头数组，格式为[{label: '显示名', key: '字段名'}]
 */
export const exportToCSV = (data, fileName, headers) => {
  try {
    // 如果没有数据，抛出错误
    if (!data || !data.length) {
      throw new Error('没有可导出的数据');
    }

    // 构建CSV内容
    let csvContent = '';
    
    // 添加表头
    if (headers && headers.length) {
      csvContent += headers.map(header => `"${header.label}"`).join(',') + '\n';
    }

    // 添加数据行
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header.key] !== undefined ? item[header.key] : '';
        return `"${value}"`;
      }).join(',');
      csvContent += row + '\n';
    });

    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 下载文件
    saveAs(blob, `${fileName}.csv`);
    
    return true;
  } catch (error) {
    console.error('导出CSV失败:', error);
    return false;
  }
};

/**
 * 将数据导出为Excel文件
 * @param {Array} data - 要导出的数据数组
 * @param {string} fileName - 导出文件名（不含扩展名）
 * @param {Array} headers - 表头数组，格式为[{label: '显示名', key: '字段名'}]
 * @param {string} sheetName - 工作表名称
 */
export const exportToExcel = (data, fileName, headers, sheetName = 'Sheet1') => {
  try {
    // 如果没有数据，抛出错误
    if (!data || !data.length) {
      throw new Error('没有可导出的数据');
    }

    // 转换数据格式为XLSX需要的格式
    const excelData = data.map(item => {
      const row = {};
      headers.forEach(header => {
        row[header.label] = item[header.key] !== undefined ? item[header.key] : '';
      });
      return row;
    });

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    
    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // 导出Excel文件
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('导出Excel失败:', error);
    return false;
  }
};

/**
 * 格式化账单数据用于导出
 * @param {Array} bills - 账单数据
 * @param {Array} types - 账单类型数据
 * @returns {Array} - 格式化后的数据
 */
export const formatBillDataForExport = (bills, types) => {
  if (!bills || !bills.length) return [];
  
  // 创建类型映射表
  const typeMap = {};
  if (types && types.length) {
    types.forEach(type => {
      typeMap[type.id] = type.name;
    });
  }
  
  // 格式化账单数据
  return bills.map(bill => ({
    id: bill.id,
    type: typeMap[bill.type_id] || '未知类型',
    amount: bill.amount,
    date: bill.date,
    is_income: bill.is_income ? '收入' : '支出',
    remark: bill.remark || '',
    pay_type: bill.pay_type || '现金'
  }));
};

// 导出账单数据的表头定义
export const billExportHeaders = [
  { label: '账单ID', key: 'id' },
  { label: '类型', key: 'type' },
  { label: '金额', key: 'amount' },
  { label: '日期', key: 'date' },
  { label: '收支类型', key: 'is_income' },
  { label: '备注', key: 'remark' },
  { label: '支付方式', key: 'pay_type' }
];

export default {
  exportToCSV,
  exportToExcel,
  formatBillDataForExport,
  billExportHeaders
};