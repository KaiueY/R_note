// 用户API服务方法
import request from '../request';
import {
  user_register,
  user_login,
  user_info,
  user_update,
  user_settings,
  user_settings_update,
  user_stats,
  user_logout,
  user_refresh_token
} from '../paths/user';

// 用户API服务
const userService = {
  /**
   * 用户注册
   * @param {object} data - 注册信息，包含username, password, email等字段
   * @returns {Promise} - 返回Promise对象
   */
  register: (data) => {
    return request.post(user_register, data);
  },

  /**
   * 用户登录
   * @param {object} data - 登录信息，包含username, password字段
   * @returns {Promise} - 返回Promise对象
   */
  login: (data) => {
    return request.post(user_login, data);
  },

  /**
   * 获取用户信息
   * @returns {Promise} - 返回Promise对象
   */
  getUserInfo: () => {
    return request.get(user_info);
  },

  /**
   * 更新用户信息
   * @param {object} data - 用户信息
   * @returns {Promise} - 返回Promise对象
   */
  updateUserInfo: (data) => {
    return request.post(user_update, data);
  },

  /**
   * 获取用户设置
   * @returns {Promise} - 返回Promise对象
   */
  getUserSettings: () => {
    return request.get(user_settings);
  },

  /**
   * 更新用户设置
   * @param {object} data - 用户设置
   * @returns {Promise} - 返回Promise对象
   */
  updateUserSettings: (data) => {
    return request.post(user_settings_update, data);
  },

  /**
   * 获取用户统计数据
   * @returns {Promise} - 返回Promise对象
   */
  getUserStats: () => {
    return request.get(user_stats);
  },

  /**
   * 用户登出
   * @returns {Promise} - 返回Promise对象
   */
  logout: () => {
    return request.post(user_logout);
  },

  /**
   * 刷新用户令牌
   * @param {object} data - 包含refresh_token的对象
   * @returns {Promise} - 返回Promise对象
   */
  refreshToken: (data) => {
    return request.post(user_refresh_token, data);
  }
};

export default userService;