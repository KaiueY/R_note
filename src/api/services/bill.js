// 账单API服务方法
import request from '../request';
import {
  bill_list,
  bill_add,
  bill_delete,
  bill_update,
  bill_types
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
  }
};

export default billService;