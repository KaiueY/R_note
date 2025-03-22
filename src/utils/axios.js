import axios from "axios";
import { Toast } from "antd-mobile";
import { mockData } from './mockData';

// 判断是否启用Mock数据
const enableMock = process.env.NODE_ENV === 'development';

// 基础配置
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true; // 跨域携带cookie
axios.defaults.headers['X-Request-With'] = 'XMLHttpRequest'; // 设置自定义请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 开发环境使用Mock数据
    if (enableMock && mockData[response.config.url]) {
      const mockResponse = mockData[response.config.url](response.config.params || response.data || {});
      return {
        data: {
          code: '200',
          data: mockResponse,
          msg: 'success'
        }
      };
    }

    // 统一处理响应
    const { data } = response;
    if (typeof data !== 'object') {
      Toast.show('服务器异常');
      return Promise.reject(new Error('服务器异常'));
    }

    if (data.code !== '200') {
      if (data.msg) Toast.show(data.msg);
      if (data.code === '401') {
        window.location.href = '/login';
      }
      return Promise.reject(data);
    }

    return data;
  },
  error => {
    Toast.show(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default axios;