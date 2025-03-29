// 统计API服务方法
import request from '../request';
import {
  STATISTICS_LIST,
  STATISTICS_TREND,
  STATISTICS_TYPES
} from '../paths/statistics';

// 统计API服务
const statisticsService = {
  /**
   * 获取统计数据
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getStatistics: (params) => {
    return request.get(STATISTICS_LIST, params);
  },

  /**
   * 获取消费趋势
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getTrend: (params) => {
    return request.get(STATISTICS_TREND, params);
  },

  /**
   * 获取消费类型占比
   * @param {object} params - 请求参数，包含year, month字段
   * @returns {Promise} - 返回Promise对象
   */
  getTypes: (params) => {
    return request.get(STATISTICS_TYPES, params);
  }
};

export default statisticsService;