# API 接口模块

## 简介

本目录包含了应用的API请求模块，采用模块化设计，将不同功能的API接口分离到不同的文件中，便于维护和使用。

## 目录结构

```
api/
├── index.js      # 统一导出所有API和请求方法
├── user.js       # 用户相关API
├── bill.js       # 账单相关API
├── statistics.js # 统计相关API
└── README.md     # 说明文档
```

## 使用方法

### 导入API

```javascript
// 导入所有API
import { userApi, billApi, statisticsApi } from '../api';

// 或者导入单个API模块
import { userApi } from '../api';
```

### 调用API示例

```javascript
// 用户登录
userApi.login({ username: 'test', password: '123456' })
  .then(res => {
    console.log('登录成功', res);
  })
  .catch(err => {
    console.error('登录失败', err);
  });

// 获取账单数据
billApi.getBill({ year: 2023, month: 5 })
  .then(res => {
    console.log('账单数据', res);
  });

// 获取统计数据
statisticsApi.getStatistics({ year: 2023, month: 5 })
  .then(res => {
    console.log('统计数据', res);
  });
```

## 配置说明

- API请求基于axios进行封装
- 统一处理了请求和响应拦截
- 自动处理token认证
- 统一处理错误信息展示

## Mock数据切换

系统保留了Mock.js的模拟数据，但默认不使用。如需切换回Mock数据（用于开发测试），可以修改`src/utils/mockConfig.js`文件中的`ENABLE_MOCK`变量为`true`。

```javascript
// src/utils/mockConfig.js
const ENABLE_MOCK = true; // 改为true启用Mock数据
```