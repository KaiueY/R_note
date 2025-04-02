// API服务方法统一导出
import request from '../request';

// 导入各模块API服务
import userService from './user';
import billService from './bill';
import statisticsService from './statistics';
import exportService from './export';

// 统一导出所有API服务
export {
  userService,
  billService,
  statisticsService,
  exportService
};