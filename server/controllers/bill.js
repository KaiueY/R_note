// 账单相关控制器
import { pool } from '../config/db.js';
import { formatResponse, formatError } from '../utils/index.js';

/**
 * 获取账单列表
 */
export const getBills = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { start_date, end_date } = ctx.query;
    
    // 参数验证
    if (!start_date || !end_date) {
      throw formatError('年份和月份不能为空', 400);
    }
    

    
    // 查询账单数据
    const [bills] = await pool.query(
      `SELECT b.id, b.amount, b.date, bt.is_income as isIncome, b.remark, 
       bt.name as typeName, bt.id as type, b.status
       FROM bills b
       LEFT JOIN bill_types bt ON b.type_id = bt.id
       WHERE b.user_id = ? AND b.date BETWEEN ? AND ?
       ORDER BY b.date DESC`,
      [userId, start_date, end_date]
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
    const { amount, type_id, date, remark, pay_type, status } = ctx.request.body;
    
    // 参数验证
    if (!amount || !type_id || !date) {
      throw formatError('金额、类型和日期不能为空', 400);
    }
    
    // 插入账单数据，添加status字段
    const [result] = await pool.query(
      'INSERT INTO bills (user_id, type_id, amount, date, remark, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type_id, amount, date, remark || null, status || 'paid']
    );
    
    // 查询新添加的账单详情
    const [bills] = await pool.query(
      `SELECT b.id, b.amount, b.date, bt.is_income as isIncome, b.remark, 
       bt.name as typeName, bt.id as type, b.status
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

/**
 * 获取卡片数据
 * 卡片数据包括用户最近使用的账单类型、常用支付方式和待支付账单
 */
export const getCards = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    
    // 查询用户最近使用的账单类型（最多5个）
    const [recentTypes] = await pool.query(
      `SELECT bt.id, bt.name, bt.is_income as isIncome, COUNT(*) as count, 
       MAX(b.date) as last_used, SUM(b.amount) as total_amount
       FROM bills b
       JOIN bill_types bt ON b.type_id = bt.id
       WHERE b.user_id = ?
       GROUP BY bt.id, bt.name, bt.is_income
       ORDER BY last_used DESC, count DESC
       LIMIT 5`,
      [userId]
    );
    
    // 查询用户常用支付方式（最多3个）
    const [paymentMethods] = await pool.query(
      `SELECT pm.id, pm.name, COUNT(*) as count
       FROM bills b
       JOIN payment_methods pm ON b.payment_method_id = pm.id
       WHERE b.user_id = ?
       GROUP BY pm.id, pm.name
       ORDER BY count DESC
       LIMIT 3`,
      [userId]
    );
    
    // 查询用户待支付账单（最多5个）
    const [pendingBills] = await pool.query(
      `SELECT b.id, b.amount, b.date, bt.name as typeName, bt.id as type_id, 
       bt.is_income as isIncome, b.remark, pp.due_date, pp.priority,
       pm.id as payment_method_id, pm.name as payment_method_name
       FROM bills b
       JOIN pending_payments pp ON b.id = pp.bill_id
       JOIN bill_types bt ON b.type_id = bt.id
       LEFT JOIN payment_methods pm ON b.payment_method_id = pm.id
       WHERE b.user_id = ? AND b.status = 'pending'
       ORDER BY pp.due_date ASC, pp.priority DESC
       LIMIT 5`,
      [userId]
    );
    
    // 构建卡片数据
    const cards = recentTypes.map(type => ({
      id: `card-type-${type.id}`,
      type: type.id,
      typeName: type.name,
      isIncome: Boolean(type.isIncome),
      count: type.count,
      totalAmount: parseFloat(type.total_amount),
      lastUsed: type.last_used,
      cardType: 'bill_type'
    }));
    
    // 添加支付方式卡片
    paymentMethods.forEach(method => {
      cards.push({
        id: `card-payment-${method.id}`,
        paymentId: method.id,
        paymentName: method.name,
        count: method.count,
        cardType: 'payment_method'
      });
    });
    
    // 添加待支付账单卡片
    pendingBills.forEach(bill => {
      cards.push({
        id: `card-pending-${bill.id}`,
        billId: bill.id,
        amount: parseFloat(bill.amount),
        date: bill.date,
        dueDate: bill.due_date,
        priority: bill.priority,
        type: bill.type_id,
        typeName: bill.typeName,
        isIncome: Boolean(bill.isIncome),
        remark: bill.remark,
        paymentId: bill.payment_method_id,
        paymentName: bill.payment_method_name,
        cardType: 'pending_bill'
      });
    });
    
    ctx.body = formatResponse(cards);
  } catch (error) {
    console.error('获取卡片数据失败:', error);
    throw formatError(error.message, error.status || 500);
  }
};