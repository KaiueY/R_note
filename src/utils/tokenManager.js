// Token管理工具
import axios from 'axios';
import { Toast } from 'antd-mobile';
import Cookies from 'js-cookie';

// 创建一个新的axios实例用于刷新token，避免循环拦截
const refreshAxios = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// Token存储的键名
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

// Cookie配置
const COOKIE_OPTIONS = {
  path: '/',       // 在所有路径下可用
  secure: process.env.NODE_ENV === 'production', // 在生产环境中只通过HTTPS发送
  sameSite: 'strict' // 防止CSRF攻击
};

// Token过期时间（天）
const TOKEN_EXPIRES = 1;           // 访问令牌1天过期
const REFRESH_TOKEN_EXPIRES = 7;   // 刷新令牌7天过期

// Token管理工具
const tokenManager = {
  /**
   * 保存token和相关信息
   * @param {object} data - 包含token、refreshToken和userInfo的对象
   */
  saveTokens: (data) => {
    if (data.token) {
      Cookies.set(TOKEN_KEY, data.token, {
        ...COOKIE_OPTIONS,
        expires: TOKEN_EXPIRES
      });
    }
    
    if (data.refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, data.refreshToken, {
        ...COOKIE_OPTIONS,
        expires: REFRESH_TOKEN_EXPIRES
      });
    }
    
    if (data.userInfo) {
      // 用户信息仍然存储在localStorage中，因为它可能较大
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(data.userInfo));
    }
  },
  
  /**
   * 获取访问token
   * @returns {string|null} - 返回token或null
   */
  getToken: () => {
    return Cookies.get(TOKEN_KEY) || null;
  },
  
  /**
   * 获取刷新token
   * @returns {string|null} - 返回refreshToken或null
   */
  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },
  
  /**
   * 获取用户信息
   * @returns {object|null} - 返回用户信息对象或null
   */
  getUserInfo: () => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  /**
   * 清除所有token和用户信息
   */
  clearTokens: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
    localStorage.removeItem(USER_INFO_KEY);
  },
  
  /**
   * 刷新token
   * @returns {Promise<string>} - 返回新的token
   */
  refreshToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(new Error('No refresh token'));
      }
      
      const response = await refreshAxios.post('/user/refresh-token', { refreshToken });
      const { data } = response;
      
      if (data && data.status === 'success') {
        // 兼容后端返回的token字段名可能是accessToken或token
        const newToken = data.data.accessToken || data.data.token;
        if (newToken) {
          Cookies.set(TOKEN_KEY, newToken, {
            ...COOKIE_OPTIONS,
            expires: TOKEN_EXPIRES
          });
          return newToken;
        }
      }
      
      return Promise.reject(new Error('Failed to refresh token'));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * 处理token过期，重定向到登录页
   */
  handleTokenExpired: () => {
    // 清除token
    tokenManager.clearTokens();
    
    // 显示提示
    Toast.show('登录已过期，请重新登录');
    
    // 保存当前路径，用于登录后跳回
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      // 使用history API保存当前路径
      window.history.replaceState(null, '', `/login?redirect=${encodeURIComponent(currentPath)}`);
    } else {
      window.location.href = '/login';
    }
  },
  
  /**
   * 检查是否已登录
   * @returns {boolean} - 是否已登录
   */
  isLoggedIn: () => {
    return !!tokenManager.getToken();
  }
};

export default tokenManager;