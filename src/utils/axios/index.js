import axios from "axios";
import { Toast } from "antd-mobile";
import tokenManager from "../tokenManager";

// 创建一个新的axios实例用于刷新token，避免循环拦截
const refreshAxios = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 基础配置
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true; // 跨域携带cookie
axios.defaults.headers['X-Request-With'] = 'XMLHttpRequest'; // 设置自定义请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 从tokenManager获取token
    const token = tokenManager.getToken();
    // 如果存在token，则添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('添加token到请求头:', `Bearer ${token}`);
    } else {
      console.log('未找到token，请求未携带Authorization头');
    }
    return config;
  },
  error => Promise.reject(error)
);

// 是否正在刷新token
let isRefreshing = false;
// 等待刷新token的请求队列
let requestsQueue = [];

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 统一处理响应
    const { data } = response;
    if (!data) {
      return Promise.reject(new Error('响应数据为空'));
    }
    
    // 处理API返回的标准格式 {status: 'success|error', data: any}
    if (data.status === 'error') {
      Toast.show(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    
    // 只返回data字段，简化调用方使用
    return data;
  },
  async error => {
    const originalRequest = error.config;
    
    // 处理HTTP错误
    if (error.response) {
      // 处理401未授权错误，可能是token过期
      if (error.response.status === 401 && !originalRequest._retry) {
        // 如果是token过期错误，尝试刷新token
        if (error.response.data?.code === 'TOKEN_EXPIRED') {
          originalRequest._retry = true;
          
          // 如果已经在刷新token，将请求加入队列
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              requestsQueue.push({
                resolve,
                reject,
                config: originalRequest
              });
            });
          }
          
          isRefreshing = true;
          
          try {
            // 使用tokenManager刷新token
            const newToken = await tokenManager.refreshToken();
            
            // 更新当前请求的token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // 处理队列中的请求
            requestsQueue.forEach(({ resolve, config }) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(axios(config));
            });
            
            // 清空队列
            requestsQueue = [];
            
            // 重试原始请求
            return axios(originalRequest);
          } catch (refreshError) {
            // 刷新token失败，清空队列并拒绝所有请求
            requestsQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            
            // 清空队列
            requestsQueue = [];
            
            // 使用tokenManager处理token过期
            tokenManager.handleTokenExpired();
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // 其他401错误，使用tokenManager处理token过期
          tokenManager.handleTokenExpired();
        }
      } else {
        Toast.show(error.response.data?.message || `请求失败(${error.response.status})`);
      }
    } else {
      Toast.show(error.message || '网络错误');
    }
    return Promise.reject(error);
  }
);

export default axios;