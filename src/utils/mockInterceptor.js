import axios from 'axios';
import { mockData } from './mockData';

// 判断是否启用Mock数据
const enableMock = process.env.NODE_ENV === 'development';

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果是开发环境且启用了Mock，返回Mock数据
    if (enableMock && mockData[response.config.url]) {
      const mockResponse = mockData[response.config.url](response.config.params || {});
      return {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: response.headers,
        config: response.config
      };
    }
    return response;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default axios;