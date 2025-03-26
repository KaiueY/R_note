// 工具函数

/**
 * 格式化响应数据
 * @param {Object} data - 响应数据
 * @param {String} message - 响应消息
 * @param {Boolean} success - 是否成功
 * @returns {Object} 格式化后的响应对象
 */
export const formatResponse = (data = null, message = 'Success', success = true) => {
  return {
    status: success ? 'success' : 'error',
    message,
    data
  };
};

/**
 * 格式化错误响应
 * @param {String} message - 错误消息
 * @param {Number} status - HTTP状态码
 * @returns {Object} 格式化后的错误响应对象
 */
export const formatError = (message = 'Internal Server Error', status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

/**
 * 格式化分页数据
 * @param {Array} list - 数据列表
 * @param {Number} total - 总数
 * @param {Number} page - 当前页码
 * @param {Number} pageSize - 每页条数
 * @returns {Object} 格式化后的分页数据对象
 */
export const formatPagination = (list, total, page, pageSize) => {
  return {
    list,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

/**
 * 获取当前年月
 * @returns {Object} 包含年和月的对象
 */
export const getCurrentYearMonth = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
};

/**
 * 解析查询参数中的年月
 * @param {Object} query - 查询参数对象
 * @returns {Object} 包含年和月的对象
 */
export const parseYearMonth = (query) => {
  const { year, month } = query;
  const currentDate = getCurrentYearMonth();
  
  return {
    year: year ? parseInt(year) : currentDate.year,
    month: month ? parseInt(month) : currentDate.month
  };
};