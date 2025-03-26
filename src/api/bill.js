// 账单相关API接口
import request from './index';

// 账单API接口
const billApi = {
  /**
   * 获取账单数据
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getBill: (params) => {
    return request.get('/bill', params);
  },

  /**
   * 添加账单
   * @param {object} data - 账单数据
   * @returns {Promise} - 返回Promise对象
   */
  addBill: (data) => {
    return request.post('/bill/add', data);
  },

  /**
   * 删除账单
   * @param {string} id - 账单ID
   * @returns {Promise} - 返回Promise对象
   */
  deleteBill: (id) => {
    return request.post('/bill/delete', { id });
  },

  /**
   * 更新账单
   * @param {object} data - 账单数据
   * @returns {Promise} - 返回Promise对象
   */
  updateBill: (data) => {
    return request.post('/bill/update', data);
  }
};

export default billApi;