// 用户相关的mock数据
import Mock from 'mockjs';

// 用户信息数据
const userInfo = {
  id: 'user123',
  username: '测试用户',
  avatar: 'https://avatars.githubusercontent.com/u/1',
  email: 'test@example.com',
  phone: '13800138000',
  gender: 1, // 1-男，2-女
  birthday: '1990-01-01',
  signature: '这是一个测试签名'
};

// 生成用户设置数据
const generateUserSettings = () => {
  return {
    theme: 'light', // light或dark
    language: 'zh-CN',
    notification: true,
    autoSync: true,
    dataBackup: false
  };
};

// 生成用户统计数据
const generateUserStats = () => {
  const Random = Mock.Random;
  
  return {
    totalBills: Random.integer(50, 200),
    totalAmount: Random.float(5000, 20000, 2, 2),
    averageMonthlyExpense: Random.float(1000, 5000, 2, 2),
    registerDays: Random.integer(30, 365),
    continuousLoginDays: Random.integer(1, 30)
  };
};

// 导出用户相关的mock接口
const userMock = {
  // 获取用户信息
  '/api/user/info': () => ({
    status: "success",
    data: userInfo
  }),
  
  // 获取用户设置
  '/api/user/settings': () => ({
    status: "success",
    data: generateUserSettings()
  }),
  
  // 更新用户设置
  '/api/user/settings/update': (data) => ({
    status: "success",
    data: { ...generateUserSettings(), ...data }
  }),
  
  // 获取用户统计数据
  '/api/user/stats': () => ({
    status: "success",
    data: generateUserStats()
  }),
  
  // 用户登录
  '/api/user/login': (data) => ({
    status: "success",
    data: {
      token: `token-${Date.now()}`,
      userInfo
    }
  }),
  
  // 用户注册
  '/api/user/register': (data) => ({
    status: "success",
    data: {
      token: `token-${Date.now()}`,
      userInfo: { ...userInfo, ...data, id: `user-${Date.now()}` }
    }
  }),
  
  // 用户登出
  '/api/user/logout': () => ({
    status: "success",
    data: null
  }),
  
  // 更新用户信息
  '/api/user/update': (data) => ({
    status: "success",
    data: { ...userInfo, ...data, updateTime: Date.now() }
  })
};

export default userMock;