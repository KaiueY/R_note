import Mock from 'mockjs';
import { mockData } from './mockData';

// 配置Mock.js的全局设置
Mock.setup({
  timeout: '200-600' // 模拟请求延迟
});

// 注册所有的mock接口
Object.keys(mockData).forEach(url => {
  // 处理URL，确保格式正确
  const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
  
  // 注册Mock接口
  Mock.mock(new RegExp(apiUrl), 'get', (options) => {
    console.log('Mock.js拦截到请求:', options);
    
    // 解析请求参数
    const urlParams = new URLSearchParams(options.url.split('?')[1]);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    // 调用mockData中对应的处理函数
    const mockFn = mockData[url];
    if (typeof mockFn === 'function') {
      return mockFn(params);
    }
    return mockFn;
  });
  
  // 对于POST请求也进行拦截
  Mock.mock(new RegExp(apiUrl), 'post', (options) => {
    console.log('Mock.js拦截到POST请求:', options);
    
    // 解析请求体
    let body = {};
    try {
      body = JSON.parse(options.body);
    } catch (e) {
      console.error('解析请求体失败:', e);
    }
    
    // 调用mockData中对应的处理函数
    const mockFn = mockData[url];
    if (typeof mockFn === 'function') {
      return mockFn(body);
    }
    return mockFn;
  });
});

console.log('Mock.js已初始化，已注册接口:', Object.keys(mockData));