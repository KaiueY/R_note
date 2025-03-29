// 用户API服务方法
import request from '../request';
import {
  USER_REGISTER,
  USER_LOGIN,
  USER_INFO,
  USER_UPDATE,
  USER_SETTINGS,
  USER_SETTINGS_UPDATE,
  USER_STATS,
  USER_LOGOUT,
  USER_REFRESH_TOKEN
} from '../paths/user';

// 用户API服务
const userService = {
  /**
   * 用户注册
   * @param {object} data - 注册信息，包含username, password, email等字段
   * @returns {Promise} - 返回Promise对象
   */
  register: (data) => {
    return request.post(USER_REGISTER, data);
  },

  /**
   * 用户登录
   * @param {object} data - 登录信息，包含username, password字段
   * @returns {Promise} - 返回Promise对象
   */
  login: (data) => {
    return request.post(USER_LOGIN, data);
  },

  /**
   * 获取用户信息
   * @returns {Promise} - 返回Promise对象
   */
  getUserInfo: () => {
    return request.get(USER_INFO);
  },

  /**
   * 更新用户信息
   * @param {object} data - 用户信息
   * @returns {Promise} - 返回Promise对象
   */
  updateUserInfo: (data) => {
    return request.post(USER_UPDATE, data);
  },

  /**
   * 获取用户设置
   * @returns {Promise} - 返回Promise对象
   */
  getUserSettings: () => {
    return request.get(USER_SETTINGS);
  },

  /**
   * 更新用户设置
   * @param {object} data - 用户设置
   * @returns {Promise} - 返回Promise对象
   */
  updateUserSettings: (data) => {
    return request.post(USER_SETTINGS_UPDATE, data);
  },

  /**
   * 获取用户统计数据
   * @returns {Promise} - 返回Promise对象
   */
  getUserStats: () => {
    return request.get(USER_STATS);
  },

  /**
   * 用户登出
   * @returns {Promise} - 返回Promise对象
   */
  logout: () => {
    return request.post(USER_LOGOUT);
  },

  /**
   * 刷新用户令牌
   * @param {object} data - 包含refresh_token的对象
   * @returns {Promise} - 返回Promise对象
   */
  refreshToken: (data) => {
    return request.post(USER_REFRESH_TOKEN, data);
  }
};

export default userService;