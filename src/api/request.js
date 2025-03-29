// API请求封装模块
import axios from '../utils/axios';

// 请求方法封装
const request = {
  /**
   * GET请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @returns {Promise} - 返回Promise对象
   */
  get: (url, params = {}) => {
    return axios.get(url, { params });
  },

  /**
   * POST请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @returns {Promise} - 返回Promise对象
   */
  post: (url, data = {}) => {
    return axios.post(url, data);
  },

  /**
   * PUT请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @returns {Promise} - 返回Promise对象
   */
  put: (url, data = {}) => {
    return axios.put(url, data);
  },

  /**
   * DELETE请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @returns {Promise} - 返回Promise对象
   */
  delete: (url, params = {}) => {
    return axios.delete(url, { params });
  }
};

export default request;