// 身份验证中间件
import jwt from 'jsonwebtoken';
import { formatError } from '../utils/index.js';

/**
 * 验证JWT令牌
 */
export const verifyToken = async (ctx, next) => {
  // 从请求头中获取令牌
  const authHeader = ctx.headers.authorization;
  
  if (!authHeader) {
    throw formatError('未提供身份验证令牌', 401);
  }
  
  // 确保正确提取token，格式应为 'Bearer token'
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw formatError('身份验证格式无效', 401);
  }
  
  const token = parts[1];
  
  try {
    // 验证令牌
    console.log('验证令牌:', token);
    console.log('使用密钥:', process.env.JWT_SECRET || 'kailin');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kailin');
    
    // 将用户信息添加到上下文状态中
    ctx.state.user = decoded;
    console.log('验证成功，用户信息:', decoded);
    
    // 标记token已验证成功
    ctx.state.tokenVerified = true;
    
    try {
      await next();
    } catch (nextError) {
      // 如果token验证成功但后续中间件出错，直接抛出原始错误，不要包装为身份验证错误
      console.error('Token验证成功，但后续处理出错:', nextError.message);
      throw nextError;
    }
  } catch (error) {
    // 只有当token验证失败时才处理为身份验证错误
    if (!ctx.state.tokenVerified) {
      console.error('Token验证错误:', error.name, error.message);
      
      if (error.name === 'TokenExpiredError') {
        // 返回特定的错误码，前端可以据此判断是否需要刷新token
        ctx.status = 401;
        ctx.body = {
          status: 'error',
          code: 'TOKEN_EXPIRED',
          message: '令牌已过期'
        };
        return;
      } else if (error.name === 'JsonWebTokenError') {
        throw formatError(`无效的令牌: ${error.message}`, 401);
      } else {
        throw formatError(`身份验证失败: ${error.message}`, 401);
      }
    } else {
      // token已验证但其他错误发生，直接抛出
      throw error;
    }
  }
};