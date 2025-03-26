import Mock from 'mockjs';

// 导入各个模块的mock数据
import billMock from './modules/bill';
import statisticsMock from './modules/statistics';
import userMock from './modules/user';

// 合并所有模块的mock数据
const mockModules = {
  ...billMock,
  ...statisticsMock,
  ...userMock
};

// 配置Mock.js的全局设置
Mock.setup({
  timeout: '200-600' // 模拟请求延迟
});

// 注册所有的mock接口
Object.keys(mockModules).forEach(url => {
  // 处理URL，确保格式正确
  const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
  
  // 注册GET请求Mock接口
  Mock.mock(new RegExp(apiUrl), 'get', (options) => {
    console.log('Mock.js拦截到GET请求:', options);
    
    // 解析请求参数
    const urlParams = new URLSearchParams(options.url.split('?')[1]);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    // 调用mockModules中对应的处理函数
    const mockFn = mockModules[url];
    if (typeof mockFn === 'function') {
      return mockFn(params);
    }
    return mockFn;
  });
  
  // 注册POST请求Mock接口
  Mock.mock(new RegExp(apiUrl), 'post', (options) => {
    console.log('Mock.js拦截到POST请求:', options);
    
    // 解析请求体
    let body = {};
    try {
      body = JSON.parse(options.body);
    } catch (e) {
      console.error('解析请求体失败:', e);
    }
    
    // 调用mockModules中对应的处理函数
    const mockFn = mockModules[url];
    if (typeof mockFn === 'function') {
      return mockFn(body);
    }
    return mockFn;
  });
});

console.log('Mock.js已初始化，已注册接口:', Object.keys(mockModules));