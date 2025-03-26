// 统计相关API接口
import request from './index';

// 统计API接口
const statisticsApi = {
  /**
   * 获取统计数据
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getStatistics: (params) => {
    return request.get('/statistics', params);
  },

  /**
   * 获取消费趋势
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getTrend: (params) => {
    return request.get('/statistics/trend', params);
  },

  /**
   * 获取消费类型占比
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getTypes: (params) => {
    return request.get('/statistics/types', params);
  }
};

export default statisticsApi;