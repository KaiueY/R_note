import axios from "axios";
import { Toast } from "antd-mobile";

// 基础配置
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true; // 跨域携带cookie
axios.defaults.headers['X-Request-With'] = 'XMLHttpRequest'; // 设置自定义请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 统一处理响应
    const { data } = response;
    if (!data) {
      return Promise.reject(new Error('响应数据为空'));
    }

    return response;
  },
  error => {
    Toast.show(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default axios;