// 用户相关控制器
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { formatResponse, formatError } from '../utils/index.js';

// 定义Token过期时间
const ACCESS_TOKEN_EXPIRES = '15m'; // 15分钟
const REFRESH_TOKEN_EXPIRES = '7d'; // 7天

/**
 * 用户注册
 */
export const register = async (ctx) => {
  const { username, password, email } = ctx.request.body;
  
  // 参数验证
  if (!username || !password) {
    throw formatError('用户名和密码不能为空', 400);
  }
  
  try {
    // 检查用户名是否已存在
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
      throw formatError('用户名已存在', 400);
    }
    
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 插入用户数据
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email || null]
    );
    
    // 创建用户设置
    await pool.query(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [result.insertId]
    );
    
    // 生成Access Token
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET || 'kailin',
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    
    // 生成Refresh Token
    const refreshToken = jwt.sign(
      { id: result.insertId, username, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || 'carol',
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    
    // 存储Token到数据库
    await pool.query(
      'INSERT INTO user_tokens (user_id, access_token, refresh_token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [result.insertId, token, refreshToken]
    );
    
    // 获取用户信息
    const [userInfo] = await pool.query(
      'SELECT id, username, email, avatar, gender, birthday, signature FROM users WHERE id = ?',
      [result.insertId]
    );
    
    ctx.body = formatResponse({
      token,
      refreshToken,
      userInfo: userInfo[0]
    });
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 用户登录
 */
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  
  // 参数验证
  if (!username || !password) {
    throw formatError('用户名和密码不能为空', 400);
  }
  
  try {
    // 查询用户
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      throw formatError('用户名或密码错误', 400);
    }
    
    const user = users[0];
    
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw formatError('用户名或密码错误', 400);
    }
    
    // 生成Access Token
    const jwtSecret = process.env.JWT_SECRET || 'kailin';
    console.log('生成token使用的密钥:', jwtSecret);
    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    console.log('生成的token:', token);
    
    // 生成Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || 'carol',
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    
    // 存储Token到数据库
    await pool.query(
      'INSERT INTO user_tokens (user_id, access_token, refresh_token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, token, refreshToken]
    );
    
    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      gender: user.gender,
      birthday: user.birthday,
      signature: user.signature
    };
    
    ctx.body = formatResponse({
      token,
      refreshToken,
      userInfo
    });
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 刷新Token
 */
export const refreshToken = async (ctx) => {
  const { refreshToken } = ctx.request.body;
  
  if (!refreshToken) {
    throw formatError('刷新令牌不能为空', 400);
  }
  
  try {
    // 验证Refresh Token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'carol'
    );
    
    // 确保是刷新令牌
    if (decoded.type !== 'refresh') {
      throw formatError('无效的刷新令牌', 401);
    }
    
    // 检查数据库中是否存在该刷新令牌
    const [tokens] = await pool.query(
      'SELECT * FROM user_tokens WHERE user_id = ? AND refresh_token = ? AND expires_at > NOW()',
      [decoded.id, refreshToken]
    );
    
    if (tokens.length === 0) {
      throw formatError('刷新令牌已失效', 401);
    }
    
    // 生成新的Access Token
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET || 'kailin',
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    
    ctx.body = formatResponse({
      accessToken: newAccessToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw formatError('刷新令牌已过期', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw formatError('无效的刷新令牌', 401);
    } else {
      throw formatError(error.message, error.status || 500);
    }
  }
};

/**
 * 登出
 */
export const logout = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { refreshToken } = ctx.request.body;
    
    // 如果提供了refreshToken，只删除特定的token
    if (refreshToken) {
      await pool.query(
        'DELETE FROM user_tokens WHERE user_id = ? AND refresh_token = ?',
        [userId, refreshToken]
      );
    } else {
      // 否则删除该用户的所有token
      await pool.query('DELETE FROM user_tokens WHERE user_id = ?', [userId]);
    }
    
    ctx.body = formatResponse(null, '登出成功');
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 获取用户信息
 */
export const getUserInfo = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    
    // 查询用户信息
    const [users] = await pool.query(
      'SELECT id, username, email, phone, avatar, gender, birthday, signature FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      throw formatError('用户不存在', 404);
    }
    
    ctx.body = formatResponse(users[0]);
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 更新用户信息
 */
export const updateUserInfo = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { email, phone, avatar, gender, birthday, signature } = ctx.request.body;
    
    // 构建更新字段
    const updateFields = [];
    const params = [];
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      params.push(email);
    }
    
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(phone);
    }
    
    if (avatar !== undefined) {
      updateFields.push('avatar = ?');
      params.push(avatar);
    }
    
    if (gender !== undefined) {
      updateFields.push('gender = ?');
      params.push(gender);
    }
    
    if (birthday !== undefined) {
      updateFields.push('birthday = ?');
      params.push(birthday);
    }
    
    if (signature !== undefined) {
      updateFields.push('signature = ?');
      params.push(signature);
    }
    
    if (updateFields.length === 0) {
      throw formatError('没有提供要更新的字段', 400);
    }
    
    // 添加用户ID
    params.push(userId);
    
    // 执行更新
    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    // 获取更新后的用户信息
    const [users] = await pool.query(
      'SELECT id, username, email, phone, avatar, gender, birthday, signature FROM users WHERE id = ?',
      [userId]
    );
    
    ctx.body = formatResponse(users[0]);
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 获取用户设置
 */
export const getUserSettings = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    
    // 查询用户设置
    const [settings] = await pool.query(
      'SELECT theme, language, notification, auto_sync, data_backup FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (settings.length === 0) {
      // 如果没有设置，创建默认设置
      await pool.query(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [userId]
      );
      
      ctx.body = formatResponse({
        theme: 'light',
        language: 'zh-CN',
        notification: true,
        auto_sync: true,
        data_backup: false
      });
    } else {
      ctx.body = formatResponse(settings[0]);
    }
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 更新用户设置
 */
export const updateUserSettings = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { theme, language, notification, auto_sync, data_backup } = ctx.request.body;
    
    // 构建更新字段
    const updateFields = [];
    const params = [];
    
    if (theme !== undefined) {
      updateFields.push('theme = ?');
      params.push(theme);
    }
    
    if (language !== undefined) {
      updateFields.push('language = ?');
      params.push(language);
    }
    
    if (notification !== undefined) {
      updateFields.push('notification = ?');
      params.push(notification);
    }
    
    if (auto_sync !== undefined) {
      updateFields.push('auto_sync = ?');
      params.push(auto_sync);
    }
    
    if (data_backup !== undefined) {
      updateFields.push('data_backup = ?');
      params.push(data_backup);
    }
    
    if (updateFields.length === 0) {
      throw formatError('没有提供要更新的字段', 400);
    }
    
    // 添加用户ID
    params.push(userId);
    
    // 检查设置是否存在
    const [settings] = await pool.query(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (settings.length === 0) {
      // 如果没有设置，创建默认设置
      await pool.query(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [userId]
      );
    }
    
    // 执行更新
    await pool.query(
      `UPDATE user_settings SET ${updateFields.join(', ')} WHERE user_id = ?`,
      params
    );
    
    // 获取更新后的设置
    const [updatedSettings] = await pool.query(
      'SELECT theme, language, notification, auto_sync, data_backup FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    ctx.body = formatResponse(updatedSettings[0]);
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};

/**
 * 获取用户统计数据
 */
export const getUserStats = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    
    // 查询用户账单总数
    const [billCountResult] = await pool.query(
      'SELECT COUNT(*) as totalBills FROM bills WHERE user_id = ?',
      [userId]
    );
    
    // 查询用户总支出
    const [expenseResult] = await pool.query(
      'SELECT SUM(b.amount) as totalExpense FROM bills b JOIN bill_types bt ON b.type_id = bt.id WHERE b.user_id = ? AND bt.is_income = 0',
      [userId]
    );
    
    // 查询用户总收入
    const [incomeResult] = await pool.query(
      'SELECT SUM(b.amount) as totalIncome FROM bills b JOIN bill_types bt ON b.type_id = bt.id WHERE b.user_id = ? AND bt.is_income = 1',
      [userId]
    );
    
    // 计算用户注册天数
    const [userResult] = await pool.query(
      'SELECT DATEDIFF(NOW(), created_at) as registerDays FROM users WHERE id = ?',
      [userId]
    );
    
    // 计算月均支出
    const registerDays = userResult[0].registerDays || 1;
    const monthCount = Math.max(1, Math.floor(registerDays / 30));
    const averageMonthlyExpense = (expenseResult[0].totalExpense || 0) / monthCount;
    
    ctx.body = formatResponse({
      totalBills: billCountResult[0].totalBills || 0,
      totalAmount: ((expenseResult[0].totalExpense || 0) + (incomeResult[0].totalIncome || 0)).toFixed(2),
      averageMonthlyExpense: averageMonthlyExpense.toFixed(2),
      registerDays: registerDays,
      continuousLoginDays: 1 // 暂时固定为1，后续可以实现登录记录功能
    });
  } catch (error) {
    throw formatError(error.message, error.status || 500);
  }
};