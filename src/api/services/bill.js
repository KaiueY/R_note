// 账单API服务方法
import request from '../request';
import {
  bill_list,
  bill_add,
  bill_delete,
  bill_update,
  bill_types,
  bill_cards
} from '../paths/bill';

// 账单API服务
const billService = {
  /**
   * 获取账单数据
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getBill: (params) => {
    return request.get(bill_list, params);
  },

  /**
   * 添加账单
   * @param {object} data - 账单数据
   * @returns {Promise} - 返回Promise对象
   */
  addBill: (data) => {
    return request.post(bill_add, data);
  },

  /**
   * 删除账单
   * @param {string} id - 账单ID
   * @returns {Promise} - 返回Promise对象
   */
  deleteBill: (id) => {
    return request.post(bill_delete, { id });
  },

  /**
   * 更新账单
   * @param {object} data - 账单数据
   * @returns {Promise} - 返回Promise对象
   */
  updateBill: (data) => {
    return request.post(bill_update, data);
  },

  /**
   * 获取账单类型
   * @returns {Promise} - 返回Promise对象
   */
  getBillTypes: () => {
    return request.get(bill_types);
  },

  /**
   * 处理卡片支付，创建新账单
   * @param {object} cardData - 卡片数据，包含type, amount, title, address等字段
   * @returns {Promise} - 返回Promise对象，包含新创建的账单数据
   */
  processCardPayment: (cardData) => {
    const { type, amount, title, address } = cardData;
    
    // 创建账单数据
    const billData = {
      type_id: type, // 使用type作为type_id发送给后端
      amount,
      date: new Date().toISOString().split('T')[0], // 格式化日期为YYYY-MM-DD
      is_income: false,
      remark: `Payment for ${title} in ${address}`,
      pay_type: 'credit'
    };
    
    // 发送支付请求到后端
    return request.post(bill_add, billData);
  },
  
  /**
   * 获取卡片数据
   * @returns {Promise} - 返回Promise对象，包含卡片数据列表
   */
  getCards: () => {
    return request.get(bill_cards);
  }
};

export default billService;