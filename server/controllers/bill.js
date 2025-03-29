// 账单相关控制器
import { pool } from '../config/db.js';
import { formatResponse, formatError } from '../utils/index.js';

/**
 * 获取账单列表
 */
export const getBills = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { year, month } = ctx.query;
    
    // 参数验证
    if (!year || !month) {
      throw formatError('年份和月份不能为空', 400);
    }
    
    // 构建日期范围
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // 获取当月最后一天
    
    // 查询账单数据
    const [bills] = await pool.query(
      `SELECT b.id, b.amount, b.date, bt.is_income as isIncome, b.remark, 
       bt.name as typeName, bt.id as type
       FROM bills b
       LEFT JOIN bill_types bt ON b.type_id = bt.id
       WHERE b.user_id = ? AND b.date BETWEEN ? AND ?
       ORDER BY b.date DESC`,
      [userId, startDate, endDate]
    );
    
    // 为每个账单添加默认支付方式
    bills.forEach(bill => {
      bill.pay_type = bill.pay_type || 'credit';
    });
    
    // 计算总收入和总支出
    const totalIncome = bills
      .filter(bill => bill.isIncome)
      .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
      
    const totalExpense = bills
      .filter(bill => !bill.isIncome)
      .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
    
    // 返回数据
    ctx.body = formatResponse([{
      list: bills,
      totalIncome,
      totalExpense,
      totalAmount: totalIncome - totalExpense
    }]);
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 添加账单
 */
export const addBill = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { amount, type_id, date, remark, pay_type } = ctx.request.body;
    
    // 参数验证
    if (!amount || !type_id || !date) {
      throw formatError('金额、类型和日期不能为空', 400);
    }
    
    // 插入账单数据
    const [result] = await pool.query(
      'INSERT INTO bills (user_id, type_id, amount, date, remark) VALUES (?, ?, ?, ?, ?)',
      [userId, type_id, amount, date, remark || null]
    );
    
    // 查询新添加的账单详情
    const [bills] = await pool.query(
      `SELECT b.id, b.amount, b.date, bt.is_income as isIncome, b.remark, 
       bt.name as typeName, bt.id as type
       FROM bills b
       LEFT JOIN bill_types bt ON b.type_id = bt.id
       WHERE b.id = ?`,
      [result.insertId]
    );
    
    // 添加支付方式信息到返回数据
    const billData = bills[0] || {};
    if (billData) {
      billData.pay_type = pay_type || 'credit';
    }
    
    ctx.body = formatResponse(billData);
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 更新账单
 */
export const updateBill = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { id, amount, typeId, date, isIncome, remark } = ctx.request.body;
    
    // 参数验证
    if (!id) {
      throw formatError('账单ID不能为空', 400);
    }
    
    // 检查账单是否存在且属于当前用户
    const [bills] = await pool.query(
      'SELECT * FROM bills WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (bills.length === 0) {
      throw formatError('账单不存在或无权限修改', 403);
    }
    
    // 构建更新字段
    const updateFields = [];
    const params = [];
    
    if (amount !== undefined) {
      updateFields.push('amount = ?');
      params.push(amount);
    }
    
    if (typeId !== undefined) {
      updateFields.push('type_id = ?');
      params.push(typeId);
    }
    
    if (date !== undefined) {
      updateFields.push('date = ?');
      params.push(date);
    }
    
    // is_income字段已从bills表移除，不再需要更新
    
    if (remark !== undefined) {
      updateFields.push('remark = ?');
      params.push(remark);
    }
    
    if (updateFields.length === 0) {
      throw formatError('没有提供要更新的字段', 400);
    }
    
    // 添加ID和用户ID
    params.push(id);
    params.push(userId);
    
    // 执行更新
    await pool.query(
      `UPDATE bills SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );
    
    // 查询更新后的账单详情
    const [updatedBills] = await pool.query(
      `SELECT b.id, b.amount, b.date, bt.is_income as isIncome, b.remark, 
       bt.name as typeName
       FROM bills b
       LEFT JOIN bill_types bt ON b.type_id = bt.id
       WHERE b.id = ?`,
      [id]
    );
    
    ctx.body = formatResponse(updatedBills[0] || {});
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 删除账单
 */
export const deleteBill = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { id } = ctx.request.body;
    
    // 参数验证
    if (!id) {
      throw formatError('账单ID不能为空', 400);
    }
    
    // 验证账单是否属于当前用户
    const [bills] = await pool.query(
      'SELECT * FROM bills WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (bills.length === 0) {
      throw formatError('账单不存在或无权限删除', 403);
    }
    
    // 删除账单
    await pool.query('DELETE FROM bills WHERE id = ?', [id]);
    
    ctx.body = formatResponse({ id, message: '删除成功' });
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 获取账单类型列表
 */
export const getBillTypes = async (ctx) => {
  try {
    // 查询所有账单类型
    const [types] = await pool.query('SELECT * FROM bill_types');
    
    ctx.body = formatResponse(types);
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};