// 用户相关API接口
import request from './index';

// 用户API接口
const userApi = {
  /**
   * 用户注册
   * @param {object} data - 注册信息，包含username, password, email等字段
   * @returns {Promise} - 返回Promise对象
   */
  register: (data) => {
    return request.post('/user/register', data);
  },

  /**
   * 用户登录
   * @param {object} data - 登录信息，包含username, password字段
   * @returns {Promise} - 返回Promise对象
   */
  login: (data) => {
    return request.post('/user/login', data);
  },

  /**
   * 获取用户信息
   * @returns {Promise} - 返回Promise对象
   */
  getUserInfo: () => {
    return request.get('/user/info');
  },

  /**
   * 更新用户信息
   * @param {object} data - 用户信息
   * @returns {Promise} - 返回Promise对象
   */
  updateUserInfo: (data) => {
    return request.post('/user/update', data);
  },

  /**
   * 获取用户设置
   * @returns {Promise} - 返回Promise对象
   */
  getUserSettings: () => {
    return request.get('/user/settings');
  },

  /**
   * 更新用户设置
   * @param {object} data - 用户设置
   * @returns {Promise} - 返回Promise对象
   */
  updateUserSettings: (data) => {
    return request.post('/user/settings/update', data);
  },

  /**
   * 获取用户统计数据
   * @returns {Promise} - 返回Promise对象
   */
  getUserStats: () => {
    return request.get('/user/stats');
  },

  /**
   * 用户登出
   * @returns {Promise} - 返回Promise对象
   */
  logout: () => {
    return request.post('/user/logout');
  }
};

export default userApi;